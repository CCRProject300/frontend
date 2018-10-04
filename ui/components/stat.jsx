import React from 'react'

function Stat ({ children, icon, color, label, value, prefix, suffix }) {
  value = sigFig(value, 3)
  prefix = prefix || ''
  suffix = suffix || ''
  label = label instanceof Array ? label : [label]
  return (
    <section className='panel display-t text-center'>
      <div className={`display-tc w-40 v-mid bg-${color}`}>
        {children || <i className={`white font-xl fa fa-${icon}`}></i>}
      </div>
      <div className='display-tc w-60 v-mid gray-light p-y-2 line-height-1'>
        <div className='font-xl count m-b-2'>{prefix}{value}{suffix}</div>
        {label.map((l) => <p key={l} className='m-t-1 m-b-0'><small>{l}</small></p>)}
      </div>
    </section>
  )
}

// Round `val` to `sf` significant figures
// https://en.wikipedia.org/wiki/Significant_figures
function sigFig (val, sf) {
  if (!val) return 0
  const sign = Math.sign(val)
  const posVal = val * sign
  const figs = Math.ceil(Math.log10(posVal))
  if (figs >= sf) return Math.round(val)
  const factor = Math.pow(10, sf - figs)
  return Math.round(val * factor) / factor
}

export default Stat
