import { metricScope, MetricsLogger } from "aws-embedded-metrics";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AWSError } from "aws-sdk";
import KLAPI from "../utils/KLAPI";
import { metricsError, metricsSuccess } from "../utils/metrics";
import { response } from "../utils/response";
import CustomDynamoClient from "../utils/CustomDynamoClient";
import { Dog } from "koekalenteri-shared/model";

const dynamoDB = new CustomDynamoClient();

const klapi = new KLAPI();

const GENDER: Record<string, 'F' | 'M'> = {
  narttu: 'F',
  female: 'F',
  tik: 'F',
  uros: 'M',
  male: 'M',
  hane: 'M'
};

export const getDogHandler = metricScope((metrics: MetricsLogger) =>
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const regNo = event.pathParameters?.regNo?.replace('~', '/');
      const refresh = event.queryStringParameters && 'refresh' in event.queryStringParameters;

      let item: Dog = await dynamoDB.read({ regNo }) as Dog;

      if (!item || refresh) {
        const { status, json } = await klapi.lueKoiranPerustiedot(regNo, '1');

        if (status === 200 && json) {
          // Cache
          item = {
            ...item, // keep refined info on refresh
            regNo: json.rekisterinumero,
            name: json.nimi,
            rfid: json.tunnistusmerkintä,
            breedCode: json.rotukoodi,
            dob: json.syntymäaika,
            gender: GENDER[json.sukupuoli],
            refreshDate: new Date()
          };
          await dynamoDB.write(item);
        }
      }

      metricsSuccess(metrics, event.requestContext, 'getDog');
      return response(200, item);
    } catch (err) {
      console.error(err);
      metricsError(metrics, event.requestContext, 'getDog');
      return response((err as AWSError).statusCode || 501, err);
    }
  }
);
