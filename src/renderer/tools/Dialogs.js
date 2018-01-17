import swal from 'sweetalert2'
export default {
  install (vue) {
    vue.prototype.$swal = swal
  }
}