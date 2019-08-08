import * as tf from '@tensorflow/tfjs';

class CPPN{
 
    constructor(patternWidth, patternHeight, P, p5){
        this.p5 = p5;

        this.netSize = 16;
        this.numHidden = 5;
        this.outputNodes = 4;
        this.P = P;
        this.latentDim = 0;
        this.activationFunction = 'tanh'

        //                0   r   L
        this.inputSize = 1 + 1 + 1 + this.latentDim

        //
        this.degrees = 360;
        this.steps = this.degrees;
        this.stepSize = this.degrees/this.steps;
        this.patternWidth = patternWidth;
        this.patternHeight = patternHeight;

        //zs - latent dimension
        this.zs = tf.randomNormal([this.latentDim], 0, 1);
        this.zs = this.zs.dataSync(); 

        this.model = this.buildModel(this.numHidden, this.activationFunction);
    }

    buildModel (numHidden, activationFunction) {
        const model = tf.sequential();
        const init  = tf.initializers.randomNormal({ mean: 0, stddev: 1 });
    
        const inputLayer = tf.layers.dense(
            { units:             this.netSize
            , batchInputShape:   [null, this.inputSize] //null means undefined number of batches of size 'inputSize'
            , activation:        activationFunction
            , kernelInitializer: init
            , biasIntializer:    init
            });
    
        model.add(inputLayer);
    
        for (let k = 0; k < numHidden-1; k++) {
            model.add(tf.layers.dense(
                { units:             this.netSize
                , activation:        activationFunction
                , kernelInitializer: init
                , biasIntializer:    init
                }
            ));
        }
    
        model.add(tf.layers.dense({ units: this.outputNodes, activation: "sigmoid" }));
    
        return model;
    }

    getModel(){
        if(this.model){
            return this.model;
        }
        else return null;
    }
    
    getInputTensorForExterior(layer){
        let pixelArr = new Array(this.steps*this.inputSize);
        let c = 0;
        for(let i = 0; i < this.degrees; i+= this.stepSize){
            //polar coordinates as input
            let input0 = Math.sin(this.P * i * (Math.PI / 180.0))
            if(input0 < 0){
                input0 = -input0;
            }
            pixelArr[c] = input0;
            c++;
            let inputr = 0;
            pixelArr[c] = inputr;
            c++;

            //layers
            pixelArr[c] = layer;
            c++;
    
            //latent vector k as input
            for(let k = 0; k < this.zs.length; k++){
                pixelArr[c] = this.zs[k];
                c++;
            }
                
        }
            
        const tfinput = tf.tensor2d(pixelArr, [this.steps, this.inputSize]);
        return tfinput;
    }
    
    getInputTensorForInterior(rmaxs, layer){
        let totalRmax = 0;
        for(let i = 0; i < rmaxs.length; i++){
            let rmax = Math.round(rmaxs[i] * this.patternWidth/2.0);
            totalRmax += rmax;
        }
        
        let pixelArr = new Array(totalRmax*this.inputSize);
        let k = 0;
        let c = 0;
        for(let i = 0; i < this.degrees; i+= this.stepSize){
            //polar coordinates as input
            let rmax = rmaxs[k];
            rmax *= this.patternWidth/2.0;
            for(let j = 0; j < Math.round(rmax); j++){
                let input0 = Math.sin(this.P * i * (Math.PI / 180.0))
                if(input0 < 0){
                    input0 = -input0;
                }
                pixelArr[c] = input0;
                c++;
    
                let inputr = j/rmax;
                pixelArr[c] = inputr;
                c++;
    
                //layers
                pixelArr[c] = layer;
                c++;
              
                //latent vector k as input
                for(let k = 0; k < this.zs.length; k++){
                    pixelArr[c] = this.zs[k];
                    c++;
                }              
            }
            k++;               
        }        
    
        const tfinput = tf.tensor2d(pixelArr, [totalRmax, this.inputSize]);
        return tfinput;
    }
    
    getRmaxs(exteriorVals){
        let arr = new Array(this.steps);
        let c = 0;
        let k = 0;
        for(let i = 0; i < this.degrees; i+= this.stepSize){
            let rmax = exteriorVals[(c+3)];
            arr[k] = rmax;
    
            c+=4;    
            k++;        
        } 
        return arr;
    }
    
    // Retrieve the weights of the model, then mutate them
    mutateModel() {
        tf.tidy(() => {
            const w = this.model.getWeights();
            for (let i = 0; i < w.length; i++) {
                let shape = w[i].shape;
                let arr = w[i].dataSync().slice(); //same as copy
                for (let j = 0; j < arr.length; j++) {
                    arr[j] = this.mutateWeight(arr[j]);
                }
                let newW = tf.tensor(arr, shape);
                w[i] = newW;
            }
            this.model.setWeights(w);
        });
    }
    
    // Mutation function
    mutateWeight(x) {
        let mutation = 0.1;
        if (this.p5.random(1) < mutation) {
            let offset = this.p5.randomGaussian() * 0.25; //0.5
            let newx = x + offset;
            return newx;
        } else {
            return x;
        }
    }

    setP(P){
        this.P = P;
    }

    getP(){
        return this.P;
    }

    //clean up
    dispose(){

    }
}

export default CPPN