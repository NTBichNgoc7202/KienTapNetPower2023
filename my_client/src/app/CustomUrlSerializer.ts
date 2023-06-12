import { UrlSerializer, UrlTree, UrlSegment, DefaultUrlSerializer } from '@angular/router';

 export class CustomUrlSerializer implements UrlSerializer {

     private dus = new DefaultUrlSerializer();

   parse(url: any): UrlTree {
        url = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
        return this.dus.parse(url)
   }

   serialize(tree: UrlTree): any {
     return this.dus.serialize(tree).replace(/%28/g, '(').replace(/%29/g, ')');
   }
 }