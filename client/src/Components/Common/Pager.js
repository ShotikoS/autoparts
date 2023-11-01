import React from "react"



const Pager = ({size, count, page, setPage}) => {
  const listItem = (page,p)=>{
    if(
      (p>page - 5 && p<=page)  || (p>=page && p<page+5)
    )
      return (
        <li key={p}>
        <button className={`${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
       </li>
      )
  }
    return (
        <nav className={"pager"}>
            <ul>
                {
                    Array.from(Array(Math.ceil(count / size)).keys())
                        .map(p =>listItem(page,p))

                }
            </ul>
        </nav>
    )
}

export default Pager