import "./assets/main.css";
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import Badge from "primevue/badge";
import Button from "primevue/button";
import Card from "primevue/card";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import PrimeVue from "primevue/config";
import DataTable from "primevue/datatable";
import DatePicker from "primevue/datepicker";
import DeferredContent from "primevue/deferredcontent";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import FileUpload from "primevue/fileupload";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Password from "primevue/password";
import Select from "primevue/select";
import Step from "primevue/step";
import StepList from "primevue/steplist";
import StepPanel from "primevue/steppanel";
import StepPanels from "primevue/steppanels";
import Stepper from "primevue/stepper";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import ToggleSwitch from "primevue/toggleswitch";
import Toolbar from "primevue/toolbar";

import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);

const preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: "{blue.50}",
            100: "{blue.100}",
            200: "{blue.200}",
            300: "{blue.300}",
            400: "{blue.400}",
            500: "{blue.500}",
            600: "{blue.600}",
            700: "{blue.700}",
            800: "{blue.800}",
            900: "{blue.900}",
            950: "{blue.950}"
        }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: preset,
        options: {
            prefix: "p",
            darkModeSelector: "system",
            cssLayer: false
        }
    }
});

app.use(ToastService);

app.component("PvToast", Toast);

app.component("PvStepper", Stepper);
app.component("PvStepList", StepList);
app.component("PvStep", Step);
app.component("PvPanel", Panel);
app.component("PvStepPanels", StepPanels);
app.component("PvStepPanel", StepPanel);

app.component("PvToolbar", Toolbar);
app.component("PvDataTable", DataTable);
app.component("PvColumn", Column);

app.component("PvPassword", Password);
app.component("PvInputText", InputText);
app.component("PvColorPicker", ColorPicker);
app.component("PvDropdown", Select);
app.component("PvToggleSwitch", ToggleSwitch);
app.component("PvDatePicker", DatePicker);

app.component("PvFileUpload", FileUpload);
app.component("PvBadge", Badge);

app.component("PvButton", Button);

app.component("PvDialog", Dialog);

app.component("PvCard", Card);
app.component("PvDivider", Divider);

app.component("PvDeferredContent", DeferredContent);

app.mount("#app");
