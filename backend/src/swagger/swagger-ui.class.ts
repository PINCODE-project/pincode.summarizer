export class SwaggerUI {
    constructor() {
    }

    private customSiteTitle = 'Voice Brief Documentation';
    private faviconFilename = 'Logo.svg';
    private topbarIconFilename = 'Logo.svg';

    private customfavIcon: string = `/static/swagger/${this.faviconFilename}`;
    private customCss: string = `
        html { height: 100%; }
        body { height: 100%; background: #242428;}
        .swagger-ui {
            min-height: 100vh;
            color: #ffffff;
        }
        
        .swagger-ui .info .title {
            color: rgb(201, 201, 201);
            text-align: center;
        }
        
        .swagger-ui .info p {
            color: #C2C2C2;
            text-align: center;
        }
        
        .swagger-ui .scheme-container {
            background-color: #202023;
        }
        
        .topbar-wrapper {
            content: url('http://localhost:5000/api/static/swagger/${this.topbarIconFilename}');
            width: 250px;
            height: auto;
        }
        
        .topbar-wrapper svg {
            visibility: hidden;
        }
        
        .swagger-ui .info .title small.version-stamp {
            display: none;
        }
        
        .swagger-ui .topbar {
            background-color: #202023;
        }
        
        .swagger-ui .opblock-tag {
            color: #FFFFFF;
        }
        
        .swagger-ui .opblock-tag p {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock-summary-control:focus {
            outline: none;
        }
        
        .swagger-ui .opblock .opblock-summary-path {
            color: #ffffff;
        }
        
        .swagger-ui .opblock .opblock-summary-description {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock.opblock-get {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
            background-color: #0090cd;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-get .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-post {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
            background-color: #0caf49;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-post .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-delete {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
            background-color: #d8070b;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-delete .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-patch {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-patch .opblock-summary-method {
            background-color: #683dd9;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-patch .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-patch .tab-header .tab-item.active h4 span::after {
            background: #737373;
        }
        
        .swagger-ui .opblock.opblock-put {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
            background-color: #F07953;
            border-color: #1668dc;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-put .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-put .tab-header .tab-item.active h4 span::after {
            background: #F07953;
        }
        
        .swagger-ui .btn.authorize {
            background-color: #1668dc;
            border-color: #1668dc;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .btn.authorize svg {
            fill: #FFFFFF;
        }
        
        .swagger-ui .btn {
            background: none;
            border-color: #C2C2C2;
            color: #C2C2C2;
            border-radius: 6px;
        }
        
        .swagger-ui .btn svg {
            fill: #FFFFFF;
        }
        
        .swagger-ui .authorization__btn svg {
            fill: #C2C2C2;
        }
        
        .swagger-ui section.models {
            border: 1px solid #737373;
            border-radius: 6px;
        }
        
        .swagger-ui section.models h4 span {
            color: #FFFFFF;
        }
        
        .swagger-ui .opblock .opblock-section-header h4 {
            color: #FFFFFF;
        }
        
        .swagger-ui .response-col_status {
            color: #FFFFFF;
        }
        
        .swagger-ui table thead tr td {
            color: #FFFFFF;
        }
        
        .swagger-ui table thead tr th {
            color: #FFFFFF;
        }
        
        .swagger-ui .expand-operation, .swagger-ui .opblock-control-arrow {
            fill: #FFFFFF;
        }
        
        .swagger-ui .opblock-description-wrapper p {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock .opblock-section-header {
            border-color: #737373;
            background-color: #4F4F53;
        }
        
        .swagger-ui .tab li button.tablinks {
            color: #FFFFFF;
        }
        
        .swagger-ui .response-col_links {
            color: #C2C2C2;
        }
        
        .swagger-ui .parameter__name {
            color: #FFFFFF;
        }
        
        .swagger-ui .parameter__type {
            color: #FFFFFF;
        }
        
        .swagger-ui .parameter__in {
            color: #C2C2C2;
        }
        
        .swagger-ui .model-title {
            color: #FFFFFF;
        }
        
        .swagger-ui .model {
            color: #FFFFFF;
        }
        
        .swagger-ui .prop-type {
            color: #F7A6DB;
        }
        
        .swagger-ui .model .property.primitive {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock-body pre.microlight {
            background: #202023 !important;
            border-radius: 6px;
        }
        
        .swagger-ui .parameter__name.required::after {
            color: #F053A1;
        }
        
        .swagger-ui .parameter__name.required span {
            color: #F053A1;
        }
        
        .swagger-ui .dialog-ux .modal-ux {
            background-color: rgb(36, 36, 36);
            box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px;
            border: 0 solid transparent;
        }
        .swagger-ui .dialog-ux .modal-ux-header {
            border-bottom: 1px solid #696969;
        }
        
        .swagger-ui .dialog-ux .modal-ux-header h3 {
            color: rgb(201, 201, 201);
        }
        
        .swagger-ui .dialog-ux .modal-ux-content h4 {
            color: rgb(201, 201, 201);
        }
        
        .swagger-ui .auth-btn-wrapper {
            gap: 20px;
        }
        
        .swagger-ui input[type="text"]::placeholder {
            color: var(--input-placeholder-color);
            opacity: 1;
        }
        
        .swagger-ui input[type="text"] {
            background: rgb(46, 46, 46);
            color: rgb(201, 201, 201);
            border: 0.5px solid var(--mantine-color-dark-4);
            border-radius: 0.5rem;
        }
        
        .swagger-ui input[type="text"]:focus:focus-within,
        .swagger-ui input[type="text"]:focus {
            outline: none;
            --input-bd: var(--input-bd-focus);
            border: 0.5px solid #1971c2;
        }
        
        .swagger-ui .dialog-ux .modal-ux-header .close-modal {
            fill: #b8b8b8
        }
        
        .swagger-ui label {
            color: rgb(201, 201, 201);
        }
        
        .swagger-ui .model-toggle::after {
            background: url("data:image/svg+xml;charset=utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><path fill=\"#b8b8b8\" d=\"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/></svg>") 50% no-repeat;
        }
        
        .swagger-ui select {
            background: rgb(46, 46, 46);
            color: rgb(201, 201, 201);
            border: 0.5px solid var(--mantine-color-dark-4);
            border-radius: 0.5rem;
        }
  `;

    private swaggerOptions = {
        persistAuthorization: true
    };

    public customOptions = {
        customfavIcon: this.customfavIcon,
        customSiteTitle: this.customSiteTitle,
        customCss: this.customCss,
        swaggerOptions: this.swaggerOptions
    };
}
