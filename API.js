console.log('DID IT')


function generateUniqueId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}




class CoreGui extends HTMLElement {
    constructor() {
        super()

        console.log('root should be enabled!')
        
    }


    ontopOfGuiBlur() {
        console.log("ontopOfGuiBlur method called");

        this.style.filter = `blur(5px)`;
    }


    connectedCallback() {
        
    }


    init() {
        console.log('GG')
    }
}




const coreScriptIds = []; // Array to store script IDs

function registerCoreScriptId(id) {
    coreScriptIds.push(id);
}

function isCoreScriptWithId(id) {
    // Check if the current script's ID is in the array
    return coreScriptIds.includes(id);
}

function isInsideCoreReplicatedStorage() {
    // Check if the current script's context has the data-in-replicatedstorage attribute
    return document.querySelector('core-script[data-in-replicatedstorage="true"]') !== null;
}

function getCallingScriptId() {
    const scriptElement = document.currentScript || (new Error().stack.split('\n')[1].match(/<core-script[^>]*id="([^"]*)"/) || [])[1];
    return scriptElement ? scriptElement.getAttribute('data-script-id') : null;
}

function isValidScript() {
    const scriptId = getCallingScriptId();
    console.log(scriptId)
    return coreScriptIds.includes(scriptId);
}

function isCoreScript() {
    // Check if the current script is running within a <core-script> element
    const scriptElement = document.querySelector('core-script[data-executing="true"]');
    console.log(isValidScript())
    console.trace()
    return scriptElement ? isCoreScriptWithId(scriptElement.getAttribute('data-script-id') || '') : false;
}


class CoreUserService extends HTMLElement {
    constructor() {
        super()
    }


    GetPlatform() {
        const userAgent = navigator.userAgent || navigator.platform;

        console.log(document.querySelector('core-script'), document)

        if (isCoreScript()) {
            if (userAgent.indexOf('Win') !== 1) return 'Windows';
            if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
            if (userAgent.indexOf('Linux') !== -1) return 'Linux';
            if (userAgent.indexOf('Android') !== -1) return 'Android';
            if (userAgent.indexOf('like Mac') !== -1) return 'iOS';
        } else {
            console.warn(`Missing CoreScript Primission to access 'GetPlatform'`)
        }

        return 'Unknown';
    }
}


class CoreReplicatedStorage extends HTMLElement {
    constructor() {
        super()

    }


    connectedCallback() {

    }
}



class CoreScript extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        });
        this.scriptId = generateUniqueId();
    }


    connectedCallback() {
        this.executeScript();
    }


    executeScript() {
        const scriptTag = this.querySelector('script');

        if (scriptTag) {
            const scriptContent = scriptTag.textContent.trim();



            try {
                this.setAttribute('data-executing', 'true');
                this.setAttribute('data-script-id', this.scriptId);
                this.setAttribute('data-corescript-name', 'Core-Script');


                registerCoreScriptId(this.getAttribute('data-script-id'));


                // Check if the parent is a <core-replicatedstorage>
                const parentElement = this.closest('core-replicatedstorage');
                if (parentElement) {
                    this.setAttribute('data-in-replicatedstorage', 'true');
                }


                eval(scriptContent)
            } catch (error) {
                console.error(error)
            }
        } else {
            console.warn('No <script> tag found inside <core-script>.');
        }
    }
}




customElements.define('core-gui', CoreGui);
customElements.define('core-userservice', CoreUserService);
customElements.define('core-replicatedstorage', CoreReplicatedStorage);


customElements.define('core-script', CoreScript);



document.addEventListener('DOMContentLoaded', function() {
    const coreGui = document.createElement('core-gui');
    const coreUserService = document.createElement('core-userservice');
    const coreReplicatedStorage = document.createElement('core-replicatedstorage');


    const CoreScriptForUser = document.createElement('core-script');




    document.documentElement.appendChild(coreGui)
    coreGui.appendChild(coreUserService);
    coreGui.appendChild(coreReplicatedStorage);

    



    CoreScriptForUser.innerHTML = `
<script>
const CoreReplicatedStorage = this.parentElement;
const CoreGui = CoreReplicatedStorage.parentElement;
const CoreUserService = CoreGui.querySelector('core-userservice')

console.log(CoreUserService.GetPlatform())
</script>
    `


    CoreScriptForUser.setAttribute('data-corescript-name', 'Player-Controller-CoreScript')

    coreReplicatedStorage.appendChild(CoreScriptForUser);





    coreGui.init()

    document.CoreGui = {
        ontopOfGuiBlur: function() {
            const coreGui = document.querySelector('core-gui');

            if (coreGui) {
                coreGui.ontopOfGuiBlur();
            } else {
                console.error("No <core-gui> element found.");
            }
        }
    }
})