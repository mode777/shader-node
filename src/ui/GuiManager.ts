import { TextureNode } from "../nodes/TextureNode";
import * as dat from "dat-gui";

let gui: dat.GUI;

export module GuiManager {
    
    export function showEditor(node: TextureNode){
        if(gui){
            gui.destroy();
            gui = null;
        }
        if(node["__gui"]){
            gui = new dat.GUI({
                width: 256
            });
            node["__gui"].forEach(editor => {      
                let controller: dat.GUIController;
                if(editor.options.type === 'color'){
                    controller = gui.addColor(node, editor.name)
                }
                else {
                    controller = gui.add(node, editor.name, editor.options.min, editor.options.max)
                }
                if(editor.options.step){
                    controller.step(editor.step)
                }
                controller.onChange(editor.options.onChange);
            });
        }
    }
    
}