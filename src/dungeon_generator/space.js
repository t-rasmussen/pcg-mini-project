class Space{

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get X(){
        return this.x;
    }

    set X(x){
        this.x = x;
    }

    get Y(){
        return this.y;
    }

    set Y(y){
        this.y = y;
    }

    get Width(){
        return this.width;
    }

    set Width(width){
        this.width = width;
    }

    get Height(){
        return this.height;
    }

    set Height(height){
        this.height = height;
    }
    
}

export default Space;