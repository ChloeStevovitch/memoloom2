import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Canvas,
  IText,
  Rect,
  Textbox,
  type ITextProps,
  type TextboxProps,
  type TOptions,
} from "fabric";

interface FabricJSCanvasProps {
  height: number;
  width: number;
  id: string;
  defaultValue?: string;
  onChange?: (newCanvasData: any) => void;
}

export interface FabricJSCanvasRef {
  addText: () => void;
  addFullPageText: () => void;
}

const FabricJSCanvas = forwardRef<FabricJSCanvasRef, FabricJSCanvasProps>(
  (
    { height: canvasHeight, width: canvasWidth, id, defaultValue, onChange },
    ref
  ) => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const padding = 20;

    // Initialize canvas
    useEffect(() => {
      if (!canvasEl.current) return;

      const options = {
        height: canvasHeight,
        width: canvasWidth,
        objectCaching: true,
      };
      const newCanvas = new Canvas(canvasEl.current, options);

      setCanvas(newCanvas);
      // Load default value if provided
      if (defaultValue) {
        try {
          newCanvas.loadFromJSON(JSON.parse(defaultValue)).then(() => {
            newCanvas.renderAll();
          });
        } catch (error) {
          console.error("Error loading default canvas data:", error);
        }
      }

      return () => {
        newCanvas.dispose();
      };
    }, [canvasHeight, canvasWidth, defaultValue]);

    // Handle canvas changes
    useEffect(() => {
      if (!canvas) return;

      const handleCanvasChange = () => {
        onChange?.(canvas.toJSON());
        console.log(canvas);
      };
      // Listen for canvas modifications
      canvas.on("object:modified", handleCanvasChange);
      canvas.on("object:added", handleCanvasChange);
      canvas.on("object:removed", handleCanvasChange);
      canvas.on("object:moving", restricObjectsMovingWithinCanvas);
      canvas.on("object:scaling", function (e) {
        restricObjectsSizingWithinCanvas(e);
      });
      //   canvas.on("text:editing:entered", function (e) {
      //     const textbox = e.target as any;
      //     const originalOnInput = textbox.onInput;

      //     textbox.onInput = function (this: typeof textbox, e: any) {
      //       // Vérifier si on dépasse la limite AVANT d'ajouter le caractère
      //       if (
      //         e.inputType === "insertText" ||
      //         e.inputType === "insertLineBreak"
      //       ) {
      //         const currentLength = textbox.text.length;
      //         const maxLength = longtext.length;

      //         if (currentLength >= maxLength) {
      //           console.log("Limite atteinte, input bloqué");
      //           e.preventDefault();
      //           return; // Empêcher l'ajout du caractère
      //         }
      //       }

      //       // Sinon, laisser le comportement normal
      //       originalOnInput.call(this, e);
      //     };
      //   });

      return () => {
        canvas.off("object:modified", handleCanvasChange);
        canvas.off("object:added", handleCanvasChange);
        canvas.off("object:removed", handleCanvasChange);
        canvas.off("object:moving", restricObjectsMovingWithinCanvas);
      };
    }, [canvas, onChange]);

    const handleDeleteKey = (canvas: Canvas, e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          const activeObject = canvas.getActiveObject();
          if (activeObject && (activeObject as any).isEditing) {
            return;
          }
          activeObjects.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };
    // Handle keyboard events (Delete/Backspace to remove objects)
    useEffect(() => {
      if (!canvas) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        handleDeleteKey(canvas, e);
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [canvas]);
    const restricObjectsMovingWithinCanvas = (e: any) => {
      const obj = e.target;
      if (obj.left < padding) {
        obj.left = padding;
      }
      if (obj.top < padding) {
        obj.top = padding;
      }

      // if object is too far right
      if (obj.left + obj.width * obj.scaleX > canvasWidth - 2 * padding) {
        obj.left = canvasWidth - padding - obj.width * obj.scaleX;
      }
      // if object is too far bottom
      if (obj.top + obj.height * obj.scaleY > canvasHeight - 2 * padding) {
        obj.top = canvasHeight - padding - obj.height * obj.scaleY;
      }
    };
    const restricObjectsSizingWithinCanvas = (e: any) => {
      const obj = e.target;
      const minSize = 20;
      // Resize text if the object is a Textbox
      const maxSize = canvasWidth - 2 * padding;
      if (obj.width * obj.scaleX < minSize) {
        obj.scaleX = minSize / obj.width;
      }
      if (obj.height * obj.scaleY < minSize) {
        obj.scaleY = minSize / obj.height;
      }
      if (obj.width * obj.scaleX > maxSize) {
        obj.scaleX = maxSize / obj.width;
      }
      if (obj.height * obj.scaleY > maxSize) {
        obj.scaleY = maxSize / obj.height;
      }
    };
    const addText = () => {
      if (!canvas) return;
      const options = {
        originX: "center",
        originY: "center",
        textAlign: "center",
        stateProperties: ["text", "fontSize"],
        breakWords: true,
      };
      const text = new Textbox("Edit me", { options });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    };
    const longtext =
      "Bacon pastrami porchetta frankfurter shankle kielbasa. Picanha t-bone drumstick ribeye, meatball brisket bacon alcatra. Turkey chuck fatback, kielbasa drumstick short ribs beef ribs.Cupim pancetta short loin hamburger venison, pork loin frankfurter sausage tongue shoulder. Chislic jerky tri-tip beef t-bone shankle capicola corned beef beef ribs short ribs kevin chuck flank. Andouille ball tip tenderloin, cow jowl picanha flank fatback ribeye. Boudin beef t-bone biltong pastrami jerky andouille ribeye short ribs spare ribs sausage.Capicola ball tip kevin buffalo t-bone drumstick, pancetta pastrami prosciutto sausage beef ribs turkey pork leberkas shankle. Capicola turkey leberkas picanha ground round rump sirloin shankle burgdoggen fatback. Ground round turducken pig pork belly short ribs alcatra picanha shankle kielbasa beef bacon kevin boudin. Prosciutto porchetta chislic capicola biltong ham shank doner andouille tenderloin short loin tri-tip frankfurter. Pastrami bresaola spare ribs shoulder picanha hamburger tail kielbasa venison, beef ribs alcatra cow ball tip. Jowl flank cupim leberkas sirloin meatball. Bacon pork loin turkey, hamburger porchetta brisket corned beef beef ribs landjaeger.T-bone kielbasa venison short ribs salami. Short ribs strip steak ham short loin pork belly. Leberkas cow swine meatloaf pig. Landjaeger pork belly kevin andouille venison pork chop, jerky leberkas. Drumstick frankfurter sausage picanha capicola bacon ball tip rump swine ground round. Tenderloin hamburger jerky pork loin. Flank ham boudin beef ribs pig cupim chislic.Leberkas frankfurter pig, rump pastrami cow meatloaf t-bone. Picanha rump fatback andouille alcatra leberkas. Chicken biltong brisket spare ribs, capicola shoulder landjaeger. Andouille biltong ham tongue landjaeger hamburger. Buffalo chicken bresaola drumstick, turducken leberkas filet mignon shank shoulder chislic pork belly jowl ham spare ribs. Capicola buffalo andouille frankfurter biltong brisket.Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!";
    const addFullPageText = () => {
      if (!canvas) return;
      const options: TOptions<TextboxProps> = {
        originX: "left",
        originY: "top",
        textAlign: "left",
        angle: 0,
        hasControls: false,
        fontSize: 15,
        left: padding,
        top: padding,
        absolutePositioned: true,
        width: canvasWidth - padding * 2,
        height: canvasHeight - padding * 2,
        maxHeight: canvasHeight - padding * 2,
        maxWidth: canvasWidth - padding * 2,
        editable: true,
        selectable: true,
        draggable: false,
        breakWords: true,
        lockScalingX: true,
        lockScalingY: true,
        scrolling: false,
        splitByGrapheme: true,
        wordwrap: "char",
      };

      const text = new Textbox(longtext, options);

      canvas.add(text);

      canvas.setActiveObject(text);
      canvas.renderAll();
    };

    // Expose addText function to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        addText,
        addFullPageText,
      }),
      [canvas]
    );

    return (
      <div>
        <canvas id={id} ref={canvasEl} />
      </div>
    );
  }
);

FabricJSCanvas.displayName = "FabricJSCanvas";

export default FabricJSCanvas;
