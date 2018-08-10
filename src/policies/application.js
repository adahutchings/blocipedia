module.exports = class ApplicationPolicy {

     constructor(user, record, collaborators) {
       this.user = user;
       this.record = record;
     }
   
     _isOwner() {
       return this.record && (this.record.userId == this.user.id);
     }
   
     _isAdmin() {
       return this.user && this.user.role == "admin";
     }

     _isStandard() {
         return this.user && this.user.role == "standard";
     }

     _isPremium() {
         return this.user && this.user.role == "premium";
     }
   
     new() {
       return this.user != null;
     }
   
     create() {
       return this.new();
     }
   
     show() {
       return true;
     }
   
     edit() {
       if(this.record.private == false){
          return this.new() && 
          this.record && (this._isStandard() || this._isAdmin() || this._isPremium());
       } else {
         return this.new() && this.record && (this._isPremium() || this._isAdmin() || this._isStandard());
       }
       
     }
   
     update() {
       return this.edit();
     }
   
     destroy() {
       return this.update();
     }

     showCollaborators() {
       return this.edit();
     }
   }