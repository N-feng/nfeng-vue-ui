import Vue from "vue";

Vue.directive('preventReClick', {
  inserted(el, binding, vnode) {
    el.addEventListener('click', () => {
      vnode.componentInstance.disabled = true
      let num = binding.value.second
      el.children[0].innerText =  `${num}秒后再确定`
      let i = setInterval(() => {
        num= (num - 0.5).toFixed(1);
        if (num <= 0.5) {
          vnode.componentInstance.disabled = false
          el.children[0].innerText = binding.value.text
          clearInterval(i);
        }else{
          vnode.componentInstance.disabled = true
          el.children[0].innerText =  `${parseInt(num)}秒后再确定`
        }
      }, 500);
    })
  }
})