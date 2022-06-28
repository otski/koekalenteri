/* eslint-disable mobx/missing-observer */
import { fireEvent, render, screen } from "@testing-library/react";
import { useLocalStorage, useSessionStorage } from ".";

function LocalTestComponent() {
  const [data, setData] = useLocalStorage("test", "useLocalStorage Default");
  return (
    <>
      <p data-testid="data">{data}</p>
      <button id="set-data" onClick={() => setData('useLocalStorage From Button')}>Change</button>
    </>
  );
}

function SessionTestComponent() {
  const [data, setData] = useSessionStorage("test", "useSessionStorage Default");
  return (
    <>
      <p data-testid="data">{data}</p>
      <button id="set-data" onClick={() => setData('useSessionStorage From Button')}>Change</button>
    </>
  );
}


function createStorageEvent(key: string, newValue: string | null, storage: Storage) {
  return new StorageEvent("storage", {
    newValue,
    key,
    oldValue: null,
    storageArea: storage
  });
}

[
  {
    name: 'useLocalStorage',
    Component: LocalTestComponent,
    storage: localStorage,
    otherStorage: sessionStorage,
  },
  {
    name: 'useSessionStorage',
    Component: SessionTestComponent,
    storage: sessionStorage,
    otherStorage: localStorage,
  }
].forEach(({name, Component, storage, otherStorage}) => {
  // eslint-disable-next-line jest/valid-title
  describe(name, () => {
    beforeEach(() => {
      storage.clear();
    });

    it('initializes default value', () => {
      render(<Component />);
      expect(screen.getByTestId('data')).toHaveTextContent(name + ' Default');
      expect(storage.getItem('test')).toEqual(null);  // the default value is not committed
    });

    it('reads previously set value', () => {
      storage.setItem('test', 'Stored Value');
      render(<Component />);
      expect(screen.getByTestId('data')).toHaveTextContent('Stored Value');
      expect(storage.getItem('test')).toEqual('Stored Value');
    });

    it('updates state and storage', () => {
      storage.setItem('test', 'Stored Value');
      render(<Component />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByTestId('data')).toHaveTextContent(name + ' From Button');
      expect(storage.getItem('test')).toEqual(name + ' From Button');
    });

    it('syncs data from other tab', () => {
      render(<Component />);
      fireEvent(window, createStorageEvent("test", "Test Sync", storage));
      expect(screen.getByTestId('data')).toHaveTextContent('Test Sync');
      expect(storage.getItem('test')).toEqual('Test Sync');
    });

    it('does not sync from different key', () => {
      render(<Component />);
      fireEvent(window, createStorageEvent("test1", "Test Sync", storage));
      expect(screen.getByTestId('data')).toHaveTextContent(name + ' Default');
      expect(storage.getItem('test')).toEqual(null);
    });

    it('does not sync from different storage', () => {
      render(<Component />);
      fireEvent(window, createStorageEvent("test", "Test Sync", otherStorage));
      expect(screen.getByTestId('data')).toHaveTextContent(name + ' Default');
      expect(storage.getItem('test')).toEqual(null);
    });
  });
});
