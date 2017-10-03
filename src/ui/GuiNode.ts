import * as $ from "jquery";
import "jquery-ui-browserify";

console.log($);

import { NodeInput } from "./NodeInput";
import { NodeManager } from "./NodeManager";

export class GuiNode {

    isRoot = false;

    inputs: NodeInput[] = [];
    attachedPaths: NodeInput[] = [];
    connected = false;

    domElement: HTMLDivElement;
    private outputDom: HTMLSpanElement;

    constructor(public name: string) {
        this.initDom();
    }

    private initDom() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('x-node');
        this.domElement.setAttribute('title', this.name);
        this.outputDom = document.createElement('span');
        this.outputDom.classList.add('x-output');
        this.outputDom.textContent = ' ';

        if (this.isRoot)
            this.outputDom.classList.add('hide');

        this.domElement.appendChild(this.outputDom);

        this.outputDom.onclick = (e) => {
            const currentInput = NodeManager.getCurrentInput();
            if (currentInput && !this.ownsInput(currentInput)) {
                this.connectTo(currentInput);
                NodeManager.setCurrentInput(undefined);
            }
            e.stopPropagation();
        };
    }

    getOutputPoint() {
        const fchild = <HTMLDivElement>this.domElement.firstElementChild;
        const offset = NodeManager.getFullOffset(fchild);
        return {
            x: offset.left + fchild.offsetWidth / 2,
            y: offset.top + fchild.offsetHeight / 2
        };
    }

    addInput(name: string) {
        const input = new NodeInput(name);
        this.inputs.push(input);
        this.domElement.appendChild(input.domElement);

        return input;
    }

    detachInput(input: NodeInput) {
        let index = -1;
        for (let i = 0; i < this.attachedPaths.length; i++) {
            if (this.attachedPaths[i] === input)
                index = i;
        }

        if (index >= 0) {
            this.attachedPaths[index].path.removeAttribute('d');
            this.attachedPaths[index].node = undefined;
            this.attachedPaths.splice(index, 1);
        }

        if (this.attachedPaths.length <= 0)
            this.domElement.classList.remove('connected');
    }

    ownsInput(input: NodeInput) {
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i] == input)
                return true;
        }

        return false;
    }

    updatePosition() {
        const outputPt = this.getOutputPoint();

        for (let i = 0; i < this.attachedPaths.length; i++) {
            const inputPt = this.attachedPaths[i].getAttachPoint();
            const pathStr = NodeManager.createPath(inputPt, outputPt);
            this.attachedPaths[i].path.setAttributeNS(null, 'd', pathStr);
        }

        for (let j = 0; j < this.inputs.length; j++) {
            if (this.inputs[j].node === undefined) continue;

            const inputPt = this.inputs[j].getAttachPoint();
            const outputPt = this.inputs[j].node.getOutputPoint();

            const pathStr = NodeManager.createPath(inputPt, outputPt);
            this.inputs[j].path.setAttributeNS(null, 'd', pathStr);
        }
    }

    connectTo(input: NodeInput) {
        input.node = this;
        this.connected = true;
        this.domElement.classList.add('connected');

        input.domElement.classList.remove('empty');
        input.domElement.classList.add('filled');

        this.attachedPaths.push(input);

        const inputPt = input.getAttachPoint();
        const outputPt = this.getOutputPoint();

        const pathStr = NodeManager.createPath(inputPt, outputPt);
        input.path.setAttributeNS(null, 'd', pathStr);
    }

    moveTo(point: {x: number, y: number}) {
        this.domElement.style.top = point.y + 'px';
        this.domElement.style.left = point.x + 'px';
        this.updatePosition();
    }

    initUI() {
        const that = this;

        $(this.domElement).draggable({
            containment: 'window',
            cancel: '.x-connection, .x-output, .x-input',
            drag: function (e, ui) {
                that.updatePosition();
            }
        });

        this.domElement.style.position = 'absolute';
        NodeManager.getContainer().appendChild(this.domElement);
        this.updatePosition();
    }

}