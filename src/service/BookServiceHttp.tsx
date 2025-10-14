const url = "http://localhost:8080/api";

class BookServiceHttp {
  async getBookLength(): Promise<number> {
    const response = await fetch(`${url}/getBookLength`);
    if (!response.ok) {
      throw new Error(`Failed to fetch book length: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}

const bookServiceHttp = new BookServiceHttp();
export default bookServiceHttp;
