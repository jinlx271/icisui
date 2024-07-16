import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
const req = require.context('./svg', false, /\.svg$/)

requireAll(req)

// polygon 转path
// var polys = document.querySelectorAll('polygon,polyline');
// [].forEach.call(polys,convertPolyToPath);

// function convertPolyToPath(poly){
//   var svgNS = poly.ownerSVGElement.namespaceURI;
//   var path = document.createElementNS(svgNS,'path');
//   var pathdata = 'M '+poly.getAttribute('points');
//   if (poly.tagName=='polygon') pathdata+='z';
//   path.setAttribute('d',pathdata);
//   poly.parentNode.replaceChild(path,poly);
// }
