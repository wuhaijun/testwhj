'use strict';
import '../public/style/main.less';
import './components/extend/jquery.popover.js'
import App from './App';

let app = new App();

$('#navy-boom-schedule').html(app);