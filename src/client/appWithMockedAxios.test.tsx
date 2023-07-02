import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import { initStore } from "./store";
import { ExampleApi, CartApi } from './api';
import { Application } from './Application';
import axios, { AxiosResponse } from 'axios';
import { Catalog } from './pages/Catalog';

const basename = '/hw/store';

describe('Header Contains Links', () => {
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
  const application = (
      <MemoryRouter>
          <Provider store={store}>
            <Application />
          </Provider>
      </MemoryRouter>
  )
  
  it (`contains link to "/"`, () => {
    const { getByTestId } = render(application);
    const link = getByTestId("main-link");
    expect(link.getAttribute("href")).toBe("/");
  });
  it (`contains link to "/catalog"`, () => {
    const { getByTestId } = render(application);
    const link = getByTestId("catalog-link");
    expect(link.getAttribute("href")).toBe("/catalog")
  });
  it (`contains link to "/delivery"`, () => {
    const { getByTestId } = render(application);
    const link = getByTestId("delivery-link");
    expect(link.getAttribute("href")).toBe("/delivery")
  });
  it (`contains link to "/contacts"`, () => {
    const { getByTestId } = render(application);
    const link = getByTestId("contacts-link");
    expect(link.getAttribute("href")).toBe("/contacts")
  });
  it (`contains link to "/cart"`, () => {
    const { getByTestId } = render(application);
    const link = getByTestId("cart-link");
    expect(link.getAttribute("href")).toBe("/cart")
  });
});

type Data = {
  id: number,
  name: string,
  price: number
}

const mockData: Data[] = [
  {id:0, name:"Gorgeous Tuna",price:774},
  {id:1,name:"Sleek Hat",price:810},
  {id:2,name:"Handcrafted Shoes",price:127},
  {id:3,name:"Generic Car",price:371}
];

const mockResponse: AxiosResponse<Data[]> = {
  data: mockData,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {},
}

jest.mock("axios");
const response = mockResponse;
(axios.get as jest.Mock).mockResolvedValue(response);

describe("test catalog", () => {
  it("items should appear correctly", async () => {
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const catalogPage = (
      <MemoryRouter>
          <Provider store={store}>
            <Catalog />
          </Provider>
      </MemoryRouter>
    );

    const { findAllByTestId } = render(catalogPage);
  
    for (const item of response.data) {
      const product = await findAllByTestId(item.id.toString());
      // console.log(product[0].outerHTML);
      expect(product.length).toBe(2);
    }
  });
});
