import { AxiosResponse } from "axios";
import { CartApi, ExampleApi } from "./api";
import { initStore } from "./store";

const basename = '/hw/store';
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

it ("items should be fetched correctly", async () => {
  const api = new ExampleApi(basename);
  jest.spyOn(api, "getProducts").mockImplementation(async () => {
    return mockResponse
  })

  const cart = new CartApi();

  const store = initStore(api, cart);

  console.log(store.getState())

  // const products = await api.getProducts();
  // console.log(products)
});