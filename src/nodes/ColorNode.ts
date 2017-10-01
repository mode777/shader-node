import * as twgl from "twgl.js";
import { TextureNode } from "./TextureNode";
import { RenderManager } from "../gl/index";
import { track } from "../model/Trackable";

export class ColorNode extends TextureNode {

    private _texture: WebGLTexture;
    private _gl = RenderManager.getContext();
    
    @track private _src: Uint8Array;

    constructor(r: number, g: number, b: number){
        super();

        this.setColor(r,g,b);
        this._texture = twgl.createTexture(this._gl, {
            format: this._gl.RGBA,
            src: this._src,
            width: 1,
            height: 1
        });
    }

    public setColor(r: number, g: number, b: number){
        this._src = new Uint8Array([r,g,b,255]);
    }

    protected refresh(){
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
        this._gl.texSubImage2D(this._gl.TEXTURE_2D, 0, 0, 0, 1, 1, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._src);
        
        return this._texture;
    }

}