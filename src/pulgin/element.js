import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Submenu, MenuItemGroup, MenuItem, Menu, Breadcrumb, BreadcrumbItem, Card, Autocomplete, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Autocomplete)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// Breadcrumb