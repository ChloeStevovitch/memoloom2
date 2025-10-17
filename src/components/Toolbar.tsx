import { useBook } from "../context/bookContext";
import Button from "./Button";

function Toolbar({}) {
  const { handleSaveBook, saveLoading, updatedPages, pageInEdition, controls } =
    useBook();
  return (
    <>
      <Button
        isDisabled={typeof pageInEdition !== "number"}
        onClick={controls.addText}
        variant="secondary"
        size="sm"
      >
        Add Text
      </Button>
      <Button
        isDisabled={typeof pageInEdition !== "number"}
        onClick={controls.addFullPageText}
        variant="secondary"
        size="sm"
      >
        Add Full Page Text
      </Button>
      <Button
        isLoading={saveLoading}
        isDisabled={updatedPages.size === 0}
        onClick={handleSaveBook}
        size="sm"
        variant="success"
      >
        Save Book
      </Button>
    </>
  );
}

export default Toolbar;
