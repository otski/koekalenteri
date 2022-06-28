import {entryDateColor} from './utils';

describe('utils', function() {
  describe('entryDateColor', function() {
    it('should return proper values based on event status', function() {
      expect(entryDateColor(false, false)).toEqual('text.primary');
      expect(entryDateColor(true, false)).toEqual('success.main');
      expect(entryDateColor(true, true)).toEqual('warning.main');
    })
  });
});
