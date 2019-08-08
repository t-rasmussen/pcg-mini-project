import * as tf from '@tensorflow/tfjs';
import CPPN from './CPPN.js';

class Flower{

    constructor(center, noOfLayers, p5){
        this.center = center;
        this.noOfLayers = noOfLayers;
        this.p5 = p5;
        this.flowerVals = [];

        this.degrees = 360;
        this.steps = this.degrees;
        this.stepSize = this.degrees/this.steps;
        this.patternWidth = 250;
        this.patternHeight = this.patternWidth;
        this.P = 3;
        this.rgb = [207, 185, 151]; //background color
    }

    getCPPN(){
        if(this.cppn){
            return this.cppn;
        }
        else{
            return null;
        }
    }

    setCPPN(cppn){
        this.flowerVals = [];
        this.cppn = cppn;
        let model = this.cppn.getModel();

        tf.tidy( () => {
            for(let layerNo = 1; layerNo <= this.noOfLayers; layerNo++){

                let inputExterior = this.cppn.getInputTensorForExterior(1.0/layerNo);

                let outputExterior = model.predict(inputExterior);

                let exteriorVals = outputExterior.dataSync();

                let rmaxs = this.cppn.getRmaxs(exteriorVals);

                let inputInterior = this.cppn.getInputTensorForInterior(rmaxs, 1.0/layerNo);
            
                let outputInterior = model.predict(inputInterior);

                let interiorVals = outputInterior.dataSync();

                this.flowerVals.push({exterior: exteriorVals, interior: interiorVals, rmaxs: rmaxs});
            }
        })
    }

    newFlower(){
        console.log("new flower")
        this.flowerVals = [];
        this.cppn = new CPPN(this.patternWidth, this.patternHeight, this.P, this.p5);
        let model = this.cppn.getModel();

        tf.tidy( () => {
            for(let layerNo = 1; layerNo <= this.noOfLayers; layerNo++){

                let inputExterior = this.cppn.getInputTensorForExterior(1.0/layerNo);

                let outputExterior = model.predict(inputExterior);

                let exteriorVals = outputExterior.dataSync();

                let rmaxs = this.cppn.getRmaxs(exteriorVals);

                let inputInterior = this.cppn.getInputTensorForInterior(rmaxs, 1.0/layerNo);
            
                let outputInterior = model.predict(inputInterior);

                let interiorVals = outputInterior.dataSync();

                this.flowerVals.push({exterior: exteriorVals, interior: interiorVals, rmaxs: rmaxs});
            }
        })
    }

    mutateFlower(){
        if(this.cppn.getModel()){
            console.log("mutate flower");
            this.cppn.mutateModel();
            let model = this.cppn.getModel();
            this.flowerVals = [];
            tf.tidy( () => {
                for(let layerNo = 1; layerNo <= this.noOfLayers; layerNo++){

                    let inputExterior = this.cppn.getInputTensorForExterior(1.0/layerNo);

                    let outputExterior = model.predict(inputExterior);

                    let exteriorVals = outputExterior.dataSync();

                    let rmaxs = this.cppn.getRmaxs(exteriorVals);

                    let inputInterior = this.cppn.getInputTensorForInterior(rmaxs, 1.0/layerNo);
                
                    let outputInterior = model.predict(inputInterior);

                    let interiorVals = outputInterior.dataSync();

                    this.flowerVals.push({exterior: exteriorVals, interior: interiorVals, rmaxs: rmaxs});
                }
            })
        }
    }

    crossOver(flower){
        console.log('cross over');
        let currentModel = this.cppn.getModel();
        let otherModel = flower.getCPPN().getModel();
        let currentP = this.P;
        let otherP = flower.getP();
        let newFlower;
        tf.tidy(() => {
            const w1 = currentModel.getWeights();
            const w2 = otherModel.getWeights();
            let newWs = new Array(w1.length);
            for (let i = 0; i < w1.length && i < w2.length; i++) {
                let shape = w1[i].shape;
                let arr1 = w1[i].dataSync().slice(); //same as copy
                let arr2 = w2[i].dataSync().slice(); //same as copy
                let newArr = new Array(arr1.length);
                for (let j = 0; j < arr1.length && j < arr2.length; j++) {
                    if(this.p5.random() > 0.5){
                        newArr[j] = arr1[j];
                    }
                    else{
                        newArr[j] = arr2[j];
                    }
                }
                let newW = tf.tensor(newArr, shape);
                newWs[i] = newW;
            }
            let newP;
            if(this.p5.random() > 0.5){
                newP = currentP;
            }
            else{
                newP = otherP;
            }
            let newCPPN = new CPPN(this.patternWidth, this.patternHeight, newP, this.p5);
            let newModel = newCPPN.getModel();
            newModel.setWeights(newWs);
            newFlower = new Flower({x:5*125, y:125}, newP, this.p5);
            newFlower.setCPPN(newCPPN);
        });

        return newFlower;
    }

    getFlowerVals(){
        return this.flowerVals;
    }

    draw(){
        for(let layer = 0; layer < this.flowerVals.length; layer++){
          
            //draw interior
            let interiorVals = this.flowerVals[layer].interior;
            let rmaxs = this.flowerVals[layer].rmaxs;
            let k = 0;
            let c = 0;
            for(let i = 0; i < this.degrees; i+= this.stepSize){
                //polar coordinates as input
                let rmax = rmaxs[k];
                rmax *= this.patternWidth / 2.0;
                for(let j = 0; j < Math.round(rmax); j++){

                    let r = Math.round(interiorVals[(c+0)] * 255.0);
                    let g = Math.round(interiorVals[(c+1)] * 255.0);
                    let b = Math.round(interiorVals[(c+2)] * 255.0);
                    
                    let x = 1.0/(layer+1) * j * Math.cos(i * Math.PI / 180.0);
                    x += this.center.x;
                    x = Math.round(x);
        
                    let y =  1.0/(layer+1) * j * Math.sin(i * Math.PI / 180.0);
                    y += this.center.y;
                    y = Math.round(y);
        
                    this.p5.set(x, y, this.p5.color(r, g, b))
                    
                    c+= 4;
                }
                k++;               
            }
        }
    }

    setP(P){
        this.P = P;
        if(this.getCPPN()){
            this.cppn.setP(P);
        }
    }

    getP(){
        return this.P;
    }

    getBackgroundColor(){
        return this.rgb;
    }

    setBackgroundColor(rgb){
        this.rgb = rgb;
    }


}

export default Flower;