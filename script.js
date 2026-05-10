const canvas = document.getElementById('homeCanvas');
const ctx = canvas.getContext('2d');
let w, h, cx, cy, t = 0;
let mouse = { x: innerWidth * 0.62, y: innerHeight * 0.40 };
let target = { ...mouse };
function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);cx=innerWidth*.62;cy=innerHeight*.40}
addEventListener('resize',resize);resize();
addEventListener('mousemove',e=>{target.x=e.clientX;target.y=e.clientY});
function draw(){mouse.x+=(target.x-mouse.x)*.055;mouse.y+=(target.y-mouse.y)*.055;ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle='#050505';ctx.fillRect(0,0,innerWidth,innerHeight);
 const dx=mouse.x-cx,dy=mouse.y-cy,dist=Math.hypot(dx,dy);ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.0012);const symmetry=18,rings=12;
 for(let s=0;s<symmetry;s++){ctx.save();ctx.rotate(Math.PI*2/symmetry*s);if(s%2)ctx.scale(1,-1);for(let r=1;r<=rings;r++){ctx.beginPath();let points=74;for(let i=0;i<=points;i++){const a=i/points*Math.PI*2;const base=r*46+Math.sin(t*.016+r)*16+dist*.025;const wave=Math.sin(a*7+t*.021+r)*22+Math.cos(a*3+dx*.006)*14;const rr=base+wave;const x=Math.cos(a)*rr*(.72+r*.018);const y=Math.sin(a)*rr*.34;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle=`rgba(238,238,238,${.045+r*.011})`;ctx.lineWidth=r%3===0?1.1:.55;ctx.stroke()}
 for(let i=0;i<95;i++){const a=i*.31+t*.005;const rr=70+i*7+Math.sin(t*.012+i)*24;const x=Math.cos(a)*rr*.92;const y=Math.sin(a)*rr*.42;const size=i%13===0?2.7:1.1;ctx.fillStyle=`rgba(238,238,238,${.16+(i%7)*.032})`;ctx.fillRect(x,y,size,size)}ctx.restore()}
 ctx.restore();drawGhostRoads(dx,dy);t++;requestAnimationFrame(draw)}
function drawGhostRoads(dx,dy){ctx.save();ctx.translate(cx,cy);ctx.globalAlpha=.16;ctx.strokeStyle='#eee';ctx.lineWidth=.9;for(let i=-10;i<=10;i++){ctx.beginPath();for(let j=-520;j<=520;j+=16){let x=j+dx*.025;let y=i*44+Math.sin(j*.018+t*.009+i)*24+dy*.014;if(j===-520)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}for(let i=-9;i<=9;i++){ctx.beginPath();for(let j=-420;j<=420;j+=16){let x=i*54+Math.sin(j*.025+t*.007+i)*22+dx*.014;let y=j+dy*.018;if(j===-420)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}ctx.restore()}
draw();
