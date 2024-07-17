<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    itemLength: {
      type: Number,
      default: 0
    }
  },
  render(h, context) {
    const { icon, title, itemLength } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      if (itemLength > 0) {
        vnodes.push(<div><span slot='title'>{(title)}</span><el-badge value={itemLength} max={99} class='item'></el-badge></div>)
      } else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>
