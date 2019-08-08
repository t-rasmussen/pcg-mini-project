//https://kwj2104.github.io/2018/cppngan/
//tutorial on how to build a CPPN network (compositional pattern producing network) 
//This simple example uses a fully connected network which takes as input euclidian coordinates (x,y) 
//and maps them to a gray-scale or color value.  
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as tf from '@tensorflow/tfjs';
import CPPN from './CPPN.js';
import Flower from './flower.js';
import { imag } from '@tensorflow/tfjs';


const imageWidth = 250*3;
const imageHeight = 250;



const sketch = (p5) => {

 
    let center1 = {x:125, y:125};
    let flower1 = new Flower(center1, 3, p5);

    let center2 = {x:3*125, y:125};
    let flower2 = new Flower(center2, 3, p5);

    let flowerCross;
    
    let canvas;

    p5.setup = () => {
        canvas = p5.createCanvas(imageWidth, imageHeight);
        canvas.parent(document.getElementById('canvasContainer'));

        let newBtn1 = p5.select('#newBtn1');
        let mutateBtn1 = p5.select('#mutateBtn1');
        newBtn1.elt.addEventListener('click', newFlower1);
        mutateBtn1.elt.addEventListener('click', mutateFlower1);

        let newBtn2 = p5.select('#newBtn2');
        let mutateBtn2 = p5.select('#mutateBtn2');
        newBtn2.elt.addEventListener('click', newFlower2);
        mutateBtn2.elt.addEventListener('click', mutateFlower2);

        let crossBtn = p5.select('#crossBtn');
        crossBtn.elt.addEventListener('click', crossOver);
        let mutateBtn3 = p5.select('#mutateBtn3');
        mutateBtn3.elt.addEventListener('click', mutateFlower3);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(0);

        flower1.draw();
        flower2.draw();

        if(flowerCross){
            flowerCross.draw();
        }
             
        p5.updatePixels();

    } 

    function newFlower1(){
        flower1.newFlower();
    }

    function mutateFlower1(){
        if(flower1.getCPPN()){
            flower1.mutateFlower();
        }
        else{
            alert("Flower 1 must be created before mutating it");
        }
    }

    function newFlower2(){
        flower2.newFlower();       
    }

    function mutateFlower2(){
        if(flower2.getCPPN()){
            flower2.mutateFlower();
        }
        else{
            alert("Flower 2 must be created before mutating it");
        }
    }

    function mutateFlower3(){
        if(flowerCross && flowerCross.getCPPN()){
            flowerCross.mutateFlower();
        }
        else{
            alert("Flower 3 must be created from flower 1 and 2 before mutating it");
        }
    }

    function crossOver(){
        if(flower1.getCPPN() && flower2.getCPPN()){
            flowerCross = flower1.crossOver(flower2);
        }
        else{
            alert("Flower 1 and 2 must be generated before crossing them");
        }
    }

    

}



new p5(sketch);

