export class Controls {
    public forward: boolean = false;
    public backward: boolean = false;
    public left: boolean = false;
    public right: boolean = false;
    public brake: boolean = false;

    constructor() {
        this.addKeyboardListeners();
        this.addTouchListeners();
    }

    private addKeyboardListeners(): void {
        document.onkeydown = (event: KeyboardEvent) => {
            switch(event.key) {
                case 'ArrowUp':
                case 'w':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                case 's':
                    this.backward = true;
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.left = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.right = true;
                    break;
                case ' ':
                    this.brake = true;
                    break;
            }
        };

        document.onkeyup = (event: KeyboardEvent) => {
            switch(event.key) {
                case 'ArrowUp':
                case 'w':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                case 's':
                    this.backward = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.right = false;
                    break;
                case ' ':
                    this.brake = false;
                    break;
            }
        };
    }

    private addTouchListeners(): void {
        // Create touch controls UI
        const touchControls = document.createElement('div');
        touchControls.id = 'touch-controls';
        touchControls.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: none;
            gap: 20px;
            touch-action: none;
        `;

        const createButton = (text: string, position: string) => {
            const button = document.createElement('div');
            button.textContent = text;
            button.style.cssText = `
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                ${position};
                user-select: none;
            `;
            return button;
        };

        const accelerateBtn = createButton('↑', 'bottom: 70px; left: 50%; transform: translateX(-50%);');
        const brakeBtn = createButton('↓', 'bottom: 0; left: 50%; transform: translateX(-50%);');
        const leftBtn = createButton('←', 'bottom: 35px; left: 0;');
        const rightBtn = createButton('→', 'bottom: 35px; right: 0;');

        touchControls.appendChild(accelerateBtn);
        touchControls.appendChild(brakeBtn);
        touchControls.appendChild(leftBtn);
        touchControls.appendChild(rightBtn);
        document.body.appendChild(touchControls);

        // Show touch controls only on mobile devices
        if ('ontouchstart' in window) {
            touchControls.style.display = 'block';
        }

        // Touch event handlers
        const handleTouch = (element: HTMLElement, control: keyof Controls) => {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this[control] = true;
            });

            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                this[control] = false;
            });
        };

        handleTouch(accelerateBtn, 'forward');
        handleTouch(brakeBtn, 'backward');
        handleTouch(leftBtn, 'left');
        handleTouch(rightBtn, 'right');
    }
} 