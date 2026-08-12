# Les one-liners golfés @yuruyurau — LA référence de fidélité

> Rapatrié le 2026-08-12 depuis la conversation claude.ai « Dé-minification et
> conversion en TypeScript » (projet Viz Light), pièce jointe du premier
> message (« Contenu collé », 5,98 Ko, 123 lignes), capturée intégralement via
> Chrome. **C'est ce texte qui fait foi** pour le régime « œuvre » (ADR 0010) :
> l'artifact `tweet-sketches-artifact.html` n'en est qu'une traduction.

Voici les **codes issus des posts** de @yuruyurau sur les **6 derniers mois**
(février → août 2026). Je n'ai gardé que les posts contenant du code minifié
`#つぶやきProcessing`.

### Août 2026

**9 août 2026**
```js
a=(y,d=mag(k=cos(i%200)*13,e=y/8-12)**2/109)=>point((q=k*3+80+k/cos(y*5)*sin(d*d-t))*sin(c=d/2-t/8)+e*sin(d+k-t)+200,(q+30)*cos(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(255,96);for(t+=PI/60,i=8.2e3;i--;)a(5*(i/200|0))}//#つぶやきProcessing
```

**9 août 2026**
```js
a=(y,d=mag(k=5*cos(i/14)*cos(y/30),e=y/8-13)**2/59+6)=>point((q=90-5*sin(atan2(k,e)*e)+k*(3+sin(d*d-t*2)))*sin(c=d/2-t/18)+200,(q+d*d**sin(d*2-t/3))*cos(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,66);for(t+=PI/20,i=1e4;i--;)a(i/43)}//#つぶやきProcessing
```

**8 août 2026**
```js
a=(x,y,o=mag(k=x/4-12.5,e=y/9+6)/9)=>point((q=3*(tan(y/2)/2+cos(y))/k+k*(5/o+o*sin(y)*sin(e+o*4-t)))+40*cos(c=o/2+e/2-t/4)+200,q*sin(c)-k*k*o/6+e*o*12)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/30,i=2e4;i--;)a(i%100,i/233)}//#つぶやきProcessing
```

**8 août 2026**
```js
a=(x,y,o=mag(k=x/4-12.5,e=y/11+7)/8)=>point((q=3*(tan(y/2)/2+cos(y))/k+k*(4/o+cos(y)/3+sin(e+o*4-t*2)))+40*cos(c=o/2+e/2-t/4)+200,q*sin(c)-k*k*o/6+e*o*11)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,66);for(t+=PI/30,i=2e4;i--;)a(i%100,i/250)}//#つぶやきProcessing
```

**1er août 2026**
```js
a=(y,d=mag(k=(4+cos(y-t))*cos(i/29),e=y/6-13)**2/22)=>point((q=3*sin(k*2)+.3/k+y/22*k*(9+2*sin(e*49-d*4+t)))+50*cos(c=d-t/2)+200,q*sin(c)+d*40+40*sin(t/4+e+4))
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,116);for(t+=PI/60,i=1e4;i--;)a(i/265)}//#つぶやきProcessing
```

### Juillet 2026

**31 juillet 2026**
```js
a=(m,d=mag(k=9*cos(i/81),e=i/461-11)**4/4e4+1.5+sin(t/2+m)/4)=>point((q=89-e*sin(k)+k*(4+2*sin(d*9+e/9-t)))*cos(c=d+sin(t-d*4)/9-t/9+m)+200,(q+30)*sin(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/60,i=1e4;i--;)a(i%3*4)}//#つぶやきProcessing
```

**29 juillet 2026** (celui qu'on avait essayé de déminifier)
```js
a=(y,d=mag(k=((y<9?9:5)+cos(y*31-t))*cos(i/44),e=y/9-14)/1.6)=>point((d*9+k*k)*cos(c=d-t/2)+200,(55+d*9)*sin(c/3)+4*sin(k*2)+y/29*k*(e+3*sin(e*4-d*4+t*3))+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/80,i=1e4;i--;)a(i/353)}//#つぶやきProcessing
```

**25 juillet 2026** (très populaire)
```js
a=(y,d=mag(k=(4+cos(i/9-t*2))*cos(i/35),e=y/7-13)+sin(e/9+t/2)-4)=>point((q=2*sin(k*3)-y/35*k*(9+k*sin(cos(e)*9-d*2+t)))+40*cos(c=d-t)+200,q*sin(c)+d*35)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/80,i=1e4;i--;)a(i/235)}//#つぶやきProcessing
```

**24 juillet 2026**
```js
a=(y,d=mag(k=(y<7?8+sin(y^9)*6:4+cos(y))*cos(i+t/2),e=y/2-13))=>point((q=y*k/5*(2+sin(d*2+y-t*4))+80)*cos(c=d/4-t/2+i%2*3)*cos(c/2+e/8)+200,q*d/8*sin(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,116);for(t+=PI/90,i=1e4;i--;)a(i/790)}//#つぶやきProcessing
```

### Mai 2026

**9 mai 2026** (attracteur de Lorenz-like)
```js
t=0,d=5e-4,draw=_=>{t++||createCanvas(w=400,w);background(9).stroke(w,96);for(x=y=z=9,i=3e4;i--;point((q=x*(e=sin(t*PI/20-x*x/99+i%9)+1)+89)*cos(k=z/59-e/29+t*PI/480+i%9*8)+200,200-(q+60*cos(k/2))*sin(k)))[x,y,z]=[x+9*(y-x)*d,y+(x*(28-z)-y)*d,z+(x*y-z-z)*d]}//#つぶやきProcessing
```

**7 mai 2026**
```js
a=(x,y,d=mag(k=4*cos(x/21),e=y/8-20))=>circle((q=3*sin(k*2)+.3/k+sin(y/19)*k*(9+2*sin(e*14-d*3+t*2)))+50*cos(c=d-t)+200,q*sin(c)+d*39-475,k*k>15?2:1)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).noStroke().fill(w,116);for(t+=PI/240,i=1e4;i--;)a(i,i/235)}#つぶやきProcessing
```

**5 mai 2026**
```js
a=(m,d=mag(k=9*cos(i/81),e=i/765-13)/4)=>point((q=79-2*sin(k*3)+sin(k*k<19?t*3+d*4:d/2+4)/2*k*(9+5*sin(d*d-e/6-t+m)))*sin(c=d*d/9-t/16+m)+200,(q+50)*cos(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/45,i=2e4;i--;)a(i%2*9)}//#つぶやきProcessing
```

### Mars 2026

**10 mars 2026**
```js
a=(m,d=mag(k=9*cos(i/61),e=i/652-13)**2/89+1)=>point((q=79-e/2*sin(k)+k/d*(6+5*sin(sin(d*d+e/9-t+m))))*sin(c=d/1.9+cos(t-d*3+m)/11-t/16+m)+200,(q+40)*cos(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/45,i=2e4;i--;)a(i%2*3)}#つぶやきProcessing
```

**8 mars 2026**
```js
a=(x,y,d=mag(k=(4+cos(y))*cos(x),e=y/6-13)-3)=>point((q=3*sin(k*2)+k/16*y*(e+2*sin(e-d*5+t))+99)*sin(c=d/1.2-t/4+i%2*3)*sin(c/4+e/6-8)+200,q*d/9*cos(c)+d*22)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,126);for(t+=PI/30,i=2e4;i--;)a(i,i/940)}//#つぶやきProcessing
```

**8 mars 2026**
```js
a=(x,y,d=mag(k=(5+sin(y))*cos(x*2),e=y/6-13)-3)=>point((q=3*sin(k*2)+k/19*y*(e+d/3*sin(e-d*4+t))+99)*sin(c=d-t/4+i%2*8)*cos(c/4+e/3)+200,q*d/9*cos(c/2+7)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,126);for(t+=PI/30,i=2e4;i--;)a(i,i/1e3)}#つぶやきProcessing
```

**7 mars 2026**
```js
a=(y,o=mag(k=cos(y*7)*(y<19?sin(t/8+y*8)*31:9),e=y/8-13)/5)=>point((q=59+cos(y)/k+k/o*3*(2+sin(o*3-e*9-t)))*sin(c=o/2-e/6-t/8+i%2*8)+200,200+q*cos(c)-99*sin(c/3))
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/30,i=2e4;i--;)a(i/600)}#つぶやきProcessing
```

**6 mars 2026**
```js
a=(m,d=mag(k=14*cos(i/39),e=i/w/3-13)**2/59+1)=>point((q=89-sin(k)*d+k*(8/d+sin(d*3+e/9-t)))*sin(c=d*.45-sin(t-d)/8-t/8+m)+200,(q+40+30*sin(c*2+m))*cos(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/45,i=3e4;i--;)a(i%2*3)}//#つぶやきProcessing
```

### Février 2026

**22 février 2026**
```js
a=(d=mag(k=8*cos(i/41),e=i/652-14)**2/79+1)=>point((q=79-2*sin(k/d*5)+sin(d/2+7)*k*(4+3*sin(sin(d*d+e/7-t))))*sin(c=d/2+sin(t-d)/d/8-t/16+i%2*3)+200,(q+40)*cos(c)+200)
t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/60,i=2e4;i--;)a()}#つぶやきProcessing
```

---
