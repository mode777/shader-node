import * as twgl from "twgl.js";
import { Framebuffer } from "../gl/index";
import { TextureNode } from "./TextureNode";
import { track } from "../model/Trackable";
import { ShaderNode } from "./ShaderNode";
import { gui, node, uniform, serialize } from "./decorators";

@node({name: "Checker", nodeId: "core.checker"})
export class CheckerNode extends ShaderNode {

    @track() @gui({ max: 16, min: 1, step: 1}) 
    @uniform() @serialize()
    tileX = 1;
    
    @track() @gui({ max: 16, min: 1, step: 1}) 
    @uniform() @serialize()
    tileY = 1;

    constructor(width = 256, height = 256){
        super(require("../../assets/shaders/basic/checkers.glsl"), width, height);
    }   
    
    set tile(val){
        this.tileX = val;
        this.tileY = val;
    }
        
}