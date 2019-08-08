//https://kwj2104.github.io/2018/cppngan/
//tutorial on how to build a CPPN network (compositional pattern producing network) 
//This simple example uses a fully connected network which takes as input euclidian coordinates (x,y) 
//and maps them to a gray-scale or color value.  
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as tf from '@tensorflow/tfjs';
import CPPN from './CPPN.js';
import Flower from './flower.js';
import Scene3d from './scene3d.js';
import { imag } from '@tensorflow/tfjs';


const imageWidth = 250;
const imageHeight = 250;
const degrees = 360;
const steps = 360;
const stepSize = degrees / steps;


const sketch = (p5) => {
   
    let center1 = {x:125, y:125};
    let flower1 = new Flower(center1, 3, p5);

    let center2 = {x:3*125, y:125};
    let flower2 = new Flower(center2, 3, p5);

    let flowerCross;
    
    let canvas;
    let scene3d = new Scene3d();

    p5.setup = () => {
        let newBtn1 = p5.select('#newBtn1');
        let mutateBtn1 = p5.select('#mutateBtn1');
        newBtn1.elt.addEventListener('click', newFlower1);
        mutateBtn1.elt.addEventListener('click', mutateFlower1);

        let newBtn2 = p5.select('#newBtn2');
        let mutateBtn2 = p5.select('#mutateBtn2');
        newBtn2.elt.addEventListener('click', newFlower2);
        mutateBtn2.elt.addEventListener('click', mutateFlower2);

        let mutateBtn3= p5.select('#mutateBtn3');
        mutateBtn3.elt.addEventListener('click', mutateFlower3);

        let crossBtn = p5.select('#crossBtn');
        crossBtn.elt.addEventListener('click', crossOver);

        let buyBtn = p5.select('#buyBtn');
        buyBtn.elt.addEventListener('click', () => {
            if(flowerCross){
                alert("You purchased a mutated freak!")
            }
            else{
                alert("You need to mutate a freak, before making a purchase");
            }
        })

        let colorPallet1 = document.getElementById('colorPallet1');
        let pedalSlider1 = document.getElementById('pedalSlider1');
        let colorPallet2 = document.getElementById('colorPallet2');
        let pedalSlider2 = document.getElementById('pedalSlider2');
        let radioLogo1 = document.getElementById('radioLogo1');
        let radioPattern1 = document.getElementById('radioPattern1');
        let radioLogo2 = document.getElementById('radioLogo2');
        let radioPattern2 = document.getElementById('radioPattern2');

        colorPallet1.addEventListener('change', (e) => {
            let rgb = e.srcElement.jscolor.rgb;
            scene3d.setColorOf1(rgb);
            flower1.setBackgroundColor(rgb);

            let data = createTextureFromFlower(flower1);
            scene3d.setCanvasDataOf1(data);

        })

        pedalSlider1.addEventListener('change', () => {
            document.getElementById('pedalValue1').innerHTML = "Flower pedals frequency " + pedalSlider1.value;
            flower1.setP(pedalSlider1.value);
        })

        colorPallet2.addEventListener('change', (e) => {
            let rgb = e.srcElement.jscolor.rgb;
            scene3d.setColorOf2(rgb);
            flower2.setBackgroundColor(rgb);

            let data = createTextureFromFlower(flower2);
            scene3d.setCanvasDataOf2(data);
        })

        pedalSlider2.addEventListener('change', () => {
            document.getElementById('pedalValue2').innerHTML = "Flower pedals frequency " + pedalSlider2.value;
            flower2.setP(pedalSlider2.value);
        })

        radioLogo1.addEventListener('click', () => {
            if(radioLogo1.checked){
                scene3d.setLogoOf1(true);
                let data = createTextureFromFlower(flower1);
                scene3d.setCanvasDataOf1(data);
            }
        })

        radioPattern1.addEventListener('click', () => {
            
            if(radioPattern1.checked){
                scene3d.setLogoOf1(false);
                let data = createTextureFromFlower(flower1);
                scene3d.setCanvasDataOf1(data);
            }
        })

        radioLogo2.addEventListener('click', () => {
            if(radioLogo2.checked){
                scene3d.setLogoOf2(true);
                let data = createTextureFromFlower(flower2);
                scene3d.setCanvasDataOf2(data);
            }
        })

        radioPattern2.addEventListener('click', () => {
            
            if(radioPattern2.checked){
                scene3d.setLogoOf2(false);
                let data = createTextureFromFlower(flower2);
                scene3d.setCanvasDataOf2(data);
            }
        })
    }

    p5.draw = () => {

    } 

    function newFlower1(){
        flower1.newFlower();
        let data = createTextureFromFlower(flower1);
 
        console.log('set canvas data');
        scene3d.setCanvasDataOf1(data);
    }

    function mutateFlower1(){
        if(flower1.getCPPN()){
            flower1.mutateFlower();

            let data = createTextureFromFlower(flower1);
    
            console.log('set canvas data');
            scene3d.setCanvasDataOf1(data);
        }
        else{
            alert("Flower 1 must be created before mutating it");
        }
    }

    function newFlower2(){
        flower2.newFlower();
        let data = createTextureFromFlower(flower2);
 
        console.log('set canvas data');
        scene3d.setCanvasDataOf2(data);    
    }

    function mutateFlower2(){
        if(flower2.getCPPN()){
            flower2.mutateFlower();

            let data = createTextureFromFlower(flower2);
    
            console.log('set canvas data');
            scene3d.setCanvasDataOf2(data);
        }
        else{
            alert("Flower 1 must be created before mutating it");
        }
    }

    function mutateFlower3(){
        if(flowerCross && flowerCross.getCPPN()){
            flowerCross.mutateFlower();

            let data = createTextureFromFlower(flowerCross);
    
            console.log('set canvas data');
            scene3d.setCanvasDataOf3(data);
        }
        else{
            alert("Flower cross must be created before mutating it");
        }
    }

    function crossOver(){
        if(flower1.getCPPN() && flower2.getCPPN()){
            flowerCross = flower1.crossOver(flower2);

            //cross colors
            let rgb1 = flower1.getBackgroundColor();
            let rgb2 = flower2.getBackgroundColor();
            let rgb3 = new Array(3);
            for(let i = 0; i < rgb1.length; i++){
                if(p5.random() > 0.5){
                    rgb3[i] = rgb1[i]
                }
                else{
                    rgb3[i] = rgb2[i];
                }
            }
           
            flowerCross.setBackgroundColor(rgb3);
           
            scene3d.setColorOf3(rgb3);
           
            //device whetheer new shirt should have logo or pattern based on shirt 1 and 2
            let tshirt1 = scene3d.getTshirt1();
            let tshirt2 = scene3d.getTshirt2();
            let usingLogo1 = tshirt1.isUsingLogo();
            let usingLogo2 = tshirt2.isUsingLogo();
            
            if(p5.random() > 0.5){
                scene3d.setLogoOf3(usingLogo1);
            }
            else{
                scene3d.setLogoOf3(usingLogo2);
            }

            let data = createTextureFromFlower(flowerCross);
            scene3d.setCanvasDataOf3(data);
        }
        else{
            alert("Flower 1 and 2 must be generated before crossing them");
        }
    }

    //helper (not in use)
    function imagePixelToNormalisedCoord (x, y, imageWidth, imageHeight) {
        const normX      = (x - (imageWidth/2))  / imageWidth;
        const normY      = (y - (imageHeight/2)) / imageHeight;
        
        // TODO: Make the norm configurable
        const r = Math.sqrt(normX * normX + normY * normY);
    
        const result = [normX, normY, r];
    
        return result;
    }

    function updateTextureFromFlower(){

    }

    function createTextureFromFlower(flower){
        let flowerVals = flower.getFlowerVals();
        let rgb = flower.getBackgroundColor();
        let data = new Uint8Array( 3 * imageWidth * imageHeight );

        let stride = 0;
        for(let i = 0; i < imageWidth * imageHeight; i++){
            data[stride] = rgb[0];
            data[stride+1] = rgb[1];
            data[stride+2] = rgb[2];
            stride += 3;
        }
        for(let layer = 0; layer < flowerVals.length; layer++){         
            //draw interior
            let interiorVals = flowerVals[layer].interior;
            let rmaxs = flowerVals[layer].rmaxs;
            let k = 0;
            let c = 0;
            for(let i = 0; i < degrees; i+= stepSize){
                //polar coordinates as input
                let rmax = rmaxs[k];
                rmax *= imageWidth / 2.0;
                for(let j = 0; j < Math.round(rmax); j++){

                    let r = Math.round(interiorVals[(c+0)] * 255.0);
                    let g = Math.round(interiorVals[(c+1)] * 255.0);
                    let b = Math.round(interiorVals[(c+2)] * 255.0);
                    
                    let x = 1.0/(layer+1) * j * Math.cos(i * Math.PI / 180.0);
                    x += 125;
                    x = Math.round(x);
        
                    let y =  1.0/(layer+1) * j * Math.sin(i * Math.PI / 180.0);
                    y += 125;
                    y = Math.round(y);
        
                    let stride = y*imageWidth + x - 1 
                    stride = 3 * stride;
                    data[ stride ] = r;
                    data[ stride + 1 ] = g;
                    data[ stride + 2 ] = b; 
                    
                    c+= 4;
                }
                k++;               
            }
        }

        return data;
    }
    

}



new p5(sketch);

