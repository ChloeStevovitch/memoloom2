import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, FabricText } from "fabric";

interface FabricJSCanvasProps {
  height: number;
  width: number;
  id: string;
  defaultValue?: string;
  onChange?: (newCanvasData: any) => void;
}

export interface FabricJSCanvasRef {
  addText: () => void;
}

const FabricJSCanvas = forwardRef<FabricJSCanvasRef, FabricJSCanvasProps>(
  (
    { height: canvasHeight, width: canvasWidth, id, defaultValue, onChange },
    ref
  ) => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    // Initialize canvas
    useEffect(() => {
      if (!canvasEl.current) return;

      const options = { height: canvasHeight, width: canvasWidth };
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
      };
      // Listen for canvas modifications
      canvas.on("object:modified", handleCanvasChange);
      canvas.on("object:added", handleCanvasChange);
      canvas.on("object:removed", handleCanvasChange);
      canvas.on("object:moving", function (e) {
        restricObjectsMovingWithinCanvas(e);
      });
      canvas.on("object:scaling", function (e) {
        restricObjectsSizingWithinCanvas(e);
      });
      return () => {
        canvas.off("object:modified", handleCanvasChange);
        canvas.off("object:added", handleCanvasChange);
        canvas.off("object:removed", handleCanvasChange);
      };
    }, [canvas, onChange]);

    const restricObjectsMovingWithinCanvas = (e: any) => {
      const obj = e.target;
      const padding = 10;
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
      const padding = 20;

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
      const text = new FabricText("Edit me", {
        left: 50,
        top: 50,
      });
      canvas.add(text);
    };

    // Expose addText function to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        addText,
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
