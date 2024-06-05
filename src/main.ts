import "./assets/main.css";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import PrimeVue from "primevue/config";
import DataTable from "primevue/datatable";
import DeferredContent from "primevue/deferredcontent";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Password from "primevue/password";
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeicons/primeicons.css";
import Toolbar from "primevue/toolbar";

import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);

app.component("PvToast", Toast);

app.component("PvStepper", Stepper);
app.component("PvStepperPanel", StepperPanel);
app.component("PvPanel", Panel);

app.component("PvToolbar", Toolbar);
app.component("PvDataTable", DataTable);
app.component("PvColumn", Column);

app.component("PvPassword", Password);
app.component("PvInputText", InputText);
app.component("PvColorPicker", ColorPicker);
app.component("PvDropdown", Dropdown);
app.component("PvInputSwitch", InputSwitch);
app.component("PvCalendar", Calendar);

app.component("PvFileUpload", FileUpload);

app.component("PvButton", Button);

app.component("PvDialog", Dialog);

app.component("PvCard", Card);
app.component("PvDivider", Divider);

app.component("PvDeferredContent", DeferredContent);

app.mount("#app");
