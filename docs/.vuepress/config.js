module.exports = {
  title: "Yvue-UI Blog",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  description: "Yvue-UI框架的同步记录博客",
  base: "/yvue-ui-blog/",
  lastUpdated: "Last Updated",
  themeConfig: {
    // logo: "",
    smoothScroll: true,
    nav: [
      {text: "主页", link: "/", target: "_self"},
      {text: "文档", link: "/introduce/", target: "_self"},
      {text: "GitHub", link: "https://github.com/Ysom/yvue-ui-blog"}
    ],
    sidebar: [
      {
        title: "前置工作",
        collapsable: false,
        children: ["/introduce/"]
      },
      {
        title: "组件",
        collapsable: false,
        children: [
          "/components/button.md",
          "/components/layout.md",
          "/components/container.md",
          "/components/tabs.md",
          "/components/toast.md",
          "/components/popover.md",
          "/components/collapse.md"
        ]
      }
    ]
  }
}
