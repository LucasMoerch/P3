import "./exampleComponent.scss"

export function exampleComponent(): HTMLElement {
    const element = document.createElement("div");
    
    const row1 = document.createElement("div");
    row1.id = "row1";
    row1.innerHTML = 
    `<div class="row">
        <div class="col-4 bg-primary text-white p-3">
             Column 1
             <button class="btn btn-warning">Click Me</button>
        </div>
        <div class="col-6 bg-success text-white p-3">
             Column 2
        </div>
        <div class="col-2 bg-danger text-white p-3">
             Column 3
             <h3 class="bg-dark text-white">Hello</h3>
        </div>
    </div>`;


    const row2 = document.createElement("div");
    row2.id = "row2";
    row2.innerHTML = 
    `<div class="row mt-4">
         <div class="col-4 bg-info text-white p-3">
            4/12 width
         </div>
         <div class="col-8 bg-warning text-dark p-3">
            8/12 width
         </div>
    </div>`

    const row3 = document.createElement("div");
    row3.id = "row3";
    row3.innerHTML = 
    `<div class="row mt-4">
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
         <div class="col-1 bg-primary text-dark p-3 border border-1 border-dark">
            1/12 width
         </div>
    </div>`
  
    

    element.appendChild(row1);
    element.appendChild(row2);
    element.appendChild(row3);
    return element;
}