import type { StudioReport } from "./report-data";
import type { Workspace, BrokerProfile } from "./workspace";

export async function downloadReportPdf(report:StudioReport,workspace:Workspace,profile:BrokerProfile,imageUrl?:string){
  const brand=report.brandingMode==="personal"?profile.fullName:report.brandingMode==="co-brand"?`${workspace.name} + ${profile.fullName}`:workspace.name;
  const advisor=[profile.fullName,profile.jobTitle,profile.reraNumber?`RERA ${profile.reraNumber}`:"",profile.phone,profile.email].filter(Boolean).join(" | ");
  const lines:string[]=[brand,"PERSONALISED PROPERTY ANALYSIS",report.title,`Prepared for ${report.buyerName}`,`Template: ${report.templateName}`,`Branding mode: ${report.brandingMode}`,`Properties: ${report.propertyTitles.join(" | ")}`];
  report.sections.filter((section)=>section.enabled).forEach((section)=>{lines.push("",section.title.toUpperCase(),...wrap(section.content,88));});
  lines.push("",advisor,profile.profileSignature || profile.specialization,workspace.disclaimer);
  const image=await loadJpeg(imageUrl);
  const bytes=buildPdf(lines,workspace.primaryColor,image);
  const blob=new Blob([bytes],{type:"application/pdf"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`${slug(report.title)}.pdf`;link.click();URL.revokeObjectURL(url);
}

function buildPdf(lines:string[],color:string,image:null|{hex:string;width:number;height:number}){
  const pages:Array<string[]>=[];let cursor=0;const firstSize=image?28:42;pages.push(lines.slice(0,firstSize));cursor=firstSize;while(cursor<lines.length){pages.push(lines.slice(cursor,cursor+42));cursor+=42;}
  const objects:string[]=[];const add=(value:string)=>{objects.push(value);return objects.length;};
  const font=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const bold=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const imageId=image?add(`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${image.hex.length+1} >>\nstream\n${image.hex}>\nendstream`):0;
  const pageIds:number[]=[];const contentIds:number[]=[];
  pages.forEach((page,pageIndex)=>{const content=pageStream(page,pageIndex,color,Boolean(imageId));contentIds.push(add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));pageIds.push(add("PENDING"));});
  const pagesId=objects.length+1;add(`<< /Type /Pages /Kids [${pageIds.map((id)=>`${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
  pageIds.forEach((id,index)=>objects[id-1]=`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >>${imageId&&index===0?` /XObject << /Im1 ${imageId} 0 R >>`:""} >> /Contents ${contentIds[index]} 0 R >>`);
  const catalog=add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);let pdf="%PDF-1.4\n";const offsets=[0];objects.forEach((object,index)=>{offsets.push(pdf.length);pdf+=`${index+1} 0 obj\n${object}\nendobj\n`;});const xref=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;for(let index=1;index<offsets.length;index++)pdf+=`${String(offsets[index]).padStart(10,"0")} 00000 n \n`;pdf+=`trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;return new TextEncoder().encode(pdf);
}
function pageStream(lines:string[],page:number,color:string,hasImage:boolean){const [r,g,b]=hex(color);let stream=`${r} ${g} ${b} rg 0 792 595 50 re f\n1 1 1 rg BT /F2 15 Tf 35 813 Td (${escapePdf(page===0?"PROPERTY INTELLIGENCE REPORT":"REPORT CONTINUED")}) Tj ET\n`;if(page===0&&hasImage)stream+="q 525 0 0 175 35 600 cm /Im1 Do Q\n";let y=page===0&&hasImage?575:768;lines.forEach((raw,index)=>{const text=safe(raw);const heading=text&&text===text.toUpperCase()&&text.length<70;stream+=`0.12 0.20 0.19 rg BT /${heading?"F2":"F1"} ${heading?11:8.5} Tf 35 ${y} Td (${escapePdf(text)}) Tj ET\n`;y-=heading?20:index<6?17:14;});stream+=`0.45 0.52 0.50 rg BT /F1 7 Tf 35 22 Td (Dubai Property Intel | Page ${page+1}) Tj ET`;return stream;}
function wrap(text:string,width:number){return text.replace(/\n/g," \n ").split(" ").reduce<string[]>((lines,word)=>{if(word==="\n"){lines.push("");return lines;}const last=lines.length-1;if(last<0||lines[last].length+word.length+1>width)lines.push(word);else lines[last]+=` ${word}`;return lines;},[]);}
function safe(value:string){return value.normalize("NFKD").replace(/[^\x20-\x7E]/g,"-");}
function escapePdf(value:string){return value.replaceAll("\\","\\\\").replaceAll("(","\\(").replaceAll(")","\\)");}
function hex(value:string){const clean=value.replace("#","");return[parseInt(clean.slice(0,2),16)/255,parseInt(clean.slice(2,4),16)/255,parseInt(clean.slice(4,6),16)/255].map((item)=>item.toFixed(3));}
function slug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
async function loadJpeg(url?:string){if(!url)return null;try{const response=await fetch(url);if(!response.ok)return null;const bytes=new Uint8Array(await response.arrayBuffer());const dimensions=jpegDimensions(bytes);if(!dimensions)return null;let hex="";for(const byte of bytes)hex+=byte.toString(16).padStart(2,"0");return{hex,...dimensions};}catch{return null;}}
function jpegDimensions(bytes:Uint8Array){let index=2;while(index+9<bytes.length){if(bytes[index]!==0xff){index++;continue;}const marker=bytes[index+1];const length=(bytes[index+2]<<8)+bytes[index+3];if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))return{height:(bytes[index+5]<<8)+bytes[index+6],width:(bytes[index+7]<<8)+bytes[index+8]};index+=Math.max(length+2,2);}return null;}
