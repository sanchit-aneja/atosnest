
class CustomError extends Error {
    moreDetails:any
    constructor(name:string = 'CustomError', moreDetails:any = {}, ...params) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(...params);
  
  
      this.name = name;
      this.moreDetails = moreDetails;
    }
  }
export default CustomError