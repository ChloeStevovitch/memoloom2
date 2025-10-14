import type { Page } from "./types";

const url = "http://localhost:8080/api";

class PageServiceHttp {
  async getPage(id: number): Promise<Page> {
    const response = await fetch(`${url}/getPage/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  async updatePage(id: number, page: Page): Promise<any> {
    const response = await fetch(`${url}/updatePage/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...page,
      }),
    });
    if (!response.ok)
      throw new Error(`Failed to update page: ${response.statusText}`);

    return response.json();
  }
}

const pageServiceHttp = new PageServiceHttp();
export default pageServiceHttp;
