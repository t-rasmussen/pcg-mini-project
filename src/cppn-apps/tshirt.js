import * as THREE from 'three';
class Tshirt{

    constructor(x, y, z, scene){
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.bodyWidth = 2;
        this.bodyHeight = 3.5;
        this.armWidth = 1;
        this.armHeight = 1;
        this.rgb = [207, 185, 151]; 

        //tshirt
        let geometry2 = new THREE.BoxGeometry(this.bodyWidth,this.bodyHeight, 0.01);
        let material2 = new THREE.MeshBasicMaterial( {  color: 0xcfb997} );
        this.body = new THREE.Mesh(geometry2, material2);
        this.body.position.x = x;
        this.body.position.y = y;
        this.body.position.z = z;
        this.scene.add(this.body);

        //left arm
        let geometry3 = new THREE.BoxGeometry(this.armWidth, this.armHeight, 0.01);
        let material3 = new THREE.MeshBasicMaterial( { color: 0xcfb997} );
        this.leftArm = new THREE.Mesh(geometry3, material3);
        this.leftArm.position.x = this.x - this.bodyWidth/2.0 - this.armWidth/2.0 + 0.2;
        this.leftArm.position.y = this.y + this.bodyHeight/2.0 - this.armHeight/2.0 - 0.2;
        this.leftArm.position.z = this.z;
        this.leftArm.rotation.z = 0.2;
        this.scene.add(this.leftArm);

        //right arm
        let geometry4 = new THREE.BoxGeometry(1, 1, 0.01);
        let material4 = new THREE.MeshBasicMaterial( {  color: 0xcfb997} );
        this.rightArm = new THREE.Mesh(geometry4, material4);
        this.rightArm.position.x = this.x +  this.bodyWidth/2.0 + this.armWidth/2.0 - 0.2;
        this.rightArm.position.y = this.y +  this.bodyHeight/2.0 - this.armHeight/2.0 - 0.2;
        this.rightArm.position.z = this.z;
        this.rightArm.rotation.z = -0.2;
        this.scene.add(this.rightArm);

        this.createCenterLogo();
    }

    setCanvasData(data){
        if(this.logo){
          let texture = new THREE.DataTexture( data, 250, 250, THREE.RGBFormat );
          texture.needsUpdate = true;
          this.logo.material = new THREE.MeshBasicMaterial( { map: texture} );
        }
        else if(this.logos.length > 0) {
          for(let i = 0; i < this.logos.length; i++){
              let texture = new THREE.DataTexture( data, 250, 250, THREE.RGBFormat );
              texture.needsUpdate = true;
              this.logos[i].material = new THREE.MeshBasicMaterial( { map: texture} );
          }
        }
      }

    createCenterLogo(){
        if(this.logo){
            this.scene.remove(this.logo);
            this.logo = null;
        }
        if(this.logos){
            for(let i = 0; i < this.logos.length; i++){
                this.scene.remove(this.logos[i]);
            }
        }
        this.logos = []; 
       
        //area for texture
        let geometry = new THREE.PlaneGeometry(1.9, 1.9);
        let material = new THREE.MeshBasicMaterial( {  color: new THREE.Color(this.rgb[0]/255, this.rgb[1]/255, this.rgb[2]/255) } );
        this.logo = new THREE.Mesh( geometry, material );
        this.logo.position.z = this.z + 0.01;
        this.logo.position.y = this.y + 0.5;
        this.logo.position.x = this.x;
        this.scene.add(this.logo);
    }



    createRepeatedPattern(){
        if(this.logo){
            this.scene.remove(this.logo);
            this.logo = null;
        }
        if(this.logos){
            for(let i = 0; i < this.logos.length; i++){
                this.scene.remove(this.logos[i]);
            }
        }
        this.logos = []; 
        let xtotal = this.bodyWidth / 0.5;
        let ytotal = this.bodyHeight / 0.5;
        let c = 0;
        for(let x = 0; x < xtotal; x++){
            for(let y = 0; y < ytotal; y++){
                let geometry = new THREE.PlaneGeometry(0.5, 0.5);
                let material = new THREE.MeshBasicMaterial( {  color: new THREE.Color(this.rgb[0]/255, this.rgb[1]/255, this.rgb[2]/255) } );
                this.logos.push(new THREE.Mesh( geometry, material ));
                this.logos[c].position.z = this.z + 0.01;
                this.logos[c].position.y = this.y + y * 0.5 + 0.5/2.0 - this.bodyHeight/2;
                this.logos[c].position.x = this.x + x * 0.5 + 0.5/2.0 - this.bodyWidth/2;
                this.scene.add(this.logos[c]);
                c++;
            }
        }
    }

    updateColorOfLogo(rgb){
        if(this.logo){
            this.logo.material =  new THREE.MeshBasicMaterial( {  color: new THREE.Color(rgb[0]/255, rgb[1]/255, rgb[2]/255) });
        }
    }

    updateColorOfPattern(rgb){
        if(this.logos){
            for(let i = 0; i < this.logos.length; i++){
                this.logos[i].material = new THREE.MeshBasicMaterial( {  color: new THREE.Color(rgb[0]/255, rgb[1]/255, rgb[2]/255) });       
            }
        }
    }

    isUsingLogo(){
        if(this.logos){
            if(this.logos.length > 0){
                console.log("FFFAAALLLSE");
                return false;
            }
            else{
                return true;
            }
        }
        else {
            console.log("TTRRUUUUEEE");
            return true;
        }
    }

    //input rgb array
    setColor(rgb){
        this.rgb = rgb;
        this.body.material = new THREE.MeshBasicMaterial( {  color: new THREE.Color(rgb[0]/255, rgb[1]/255, rgb[2]/255) });
        this.leftArm.material = new THREE.MeshBasicMaterial( {  color: new THREE.Color(rgb[0]/255, rgb[1]/255, rgb[2]/255) });
        this.rightArm.material = new THREE.MeshBasicMaterial( {  color: new THREE.Color(rgb[0]/255, rgb[1]/255, rgb[2]/255) });
        this.updateColorOfLogo(rgb);
        this.updateColorOfPattern(rgb);
    }




}

export default Tshirt;