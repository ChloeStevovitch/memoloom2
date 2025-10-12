interface Book {
  id: string;
  title: string;
  content: Page[];
}

interface Page {
  id: string;
  text: string;
}
const url = "http://localhost:8080/api";

class BookServiceHttp {
  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${url}/getBooks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
    const data = await response.json();

    return data;
  }
}

const bookServiceHttp = new BookServiceHttp();
export default bookServiceHttp;
export type { Book, Page };
