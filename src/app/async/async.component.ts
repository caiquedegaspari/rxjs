import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map, toArray, delay } from 'rxjs/operators';

interface User { 
  login:string,
  name:string
}

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.css']
})
export class AsyncComponent implements OnInit {

  options$:Observable<string[]>
  user$:Observable<User>

  constructor() { }

  ngOnInit(): void {
    this.options$ = Observable.create( 
      (observer)=>{ 
        for(let i=0;i<10;i++) { 
          observer.next('this is my:'+i+'th option')
        }
        observer.complete()
      }
    )
    .pipe(
       map(s=>s+'!'), 
      toArray(),
      delay(1000)

    )
    /* this.options$.subscribe(s=>console.log(s)) */
      this.user$ = new Observable<User>(observer=>{
        let names = ['Mr Amber', 'Sr Julio','Sir Caique','Mr Andre']
        let logins = ['amber', 'julio','caique','andre']
        let i = 0
        console.log('here in user$')
        setInterval(()=>{
          if(i==4) {
            observer.complete()
            console.log('Observer completed')
           }
           else{ 
             observer.next({login:logins[i],name:names[i]})
           }
           i++
        },3000)

      })
      this.user$.subscribe(s=>console.log(s))

  }

}


