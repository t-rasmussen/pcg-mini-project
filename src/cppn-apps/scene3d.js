import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Tshirt from './tshirt.js';

class Scene3d{
    constructor(){
        this.canvasWidth = window.innerWidth * 0.5;
        this.canvasHeight = this.canvasWidth * window.innerHeight / window.innerWidth;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        document.getElementById('canvasContainer').appendChild(this.renderer.domElement );

        this.tshirt1 = new Tshirt(-2, 2, 0,this.scene);
        this.tshirt2 = new Tshirt(2, 2, 0,this.scene);
        this.tshirt3 = new Tshirt(0, -2, 0,this.scene);

        let light = new THREE.PointLight( 0xff0000, 1, 100 );
        light.position.set( 50, 50, 50 );
        this.scene.add( light );

        this.camera.position.z = 5;

        let controls = new OrbitControls(this.camera, this.renderer.domElement );
        controls.update();

        let animate = () => {
            // required if controls.enableDamping or controls.autoRotate are set to true
	        controls.update();
                    
            this.renderer.render( this.scene, this.camera );

            window.requestAnimationFrame(animate);
        }
        animate();
    }

    getTshirt1(){
        return this.tshirt1;
    }

    getTshirt2(){
        return this.tshirt2;
    }

    getTshirt3(){
        return this.tshirt3;
    }

    setCanvasDataOf1(data){
        this.tshirt1.setCanvasData(data);
    }

    setCanvasDataOf2(data){
        this.tshirt2.setCanvasData(data);
    }

    setCanvasDataOf3(data){
       this.tshirt3.setCanvasData(data);
    }

    setColorOf1(rgb){
        this.tshirt1.setColor(rgb);
    }

    setColorOf2(rgb){
        this.tshirt2.setColor(rgb);
    }

    setColorOf3(rgb){
        this.tshirt3.setColor(rgb);
    }

    setLogoOf1(createLogo){
        if(createLogo){
            this.tshirt1.createCenterLogo();
        }
        else{
            this.tshirt1.createRepeatedPattern();
        }
    }

    setLogoOf2(createLogo){
        if(createLogo){
            this.tshirt2.createCenterLogo();
        }
        else{
            this.tshirt2.createRepeatedPattern();
        }
    }

    setLogoOf3(createLogo){
        if(createLogo){
            this.tshirt3.createCenterLogo();
        }
        else{
            this.tshirt3.createRepeatedPattern();
        }
    }

    removeObject(){
        this.scene.remove(this.logo)
    }
    
}

export default Scene3d;