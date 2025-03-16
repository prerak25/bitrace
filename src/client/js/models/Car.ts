import * as THREE from 'three';
import { Controls } from '../game/Controls';

export class Car {
    public mesh: THREE.Group;
    private velocity: number = 0;
    private acceleration: number = 0;
    private maxSpeed: number = 0.5;
    private friction: number = 0.98;
    private turnSpeed: number = 0.03;
    private wheels: THREE.Mesh[] = [];
    private frontWheels: THREE.Mesh[] = []; // Track front wheels separately
    private maxWheelTurn: number = Math.PI / 4; // Maximum wheel turn angle (45 degrees)

    constructor(color: string = '#ff0000') {
        this.mesh = new THREE.Group();

        // Main body - reduced length from 4 to 3.2
        const bodyGeometry = new THREE.BoxGeometry(1.0, 0.4, 3.2);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: color });
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.set(0, 0.2, 0);
        this.mesh.add(bodyMesh);

        // Nose cone - slightly shorter
        const noseGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.0); // reduced from 1.2 to 1.0
        const noseMesh = new THREE.Mesh(noseGeometry, bodyMaterial);
        noseMesh.position.set(0, 0.15, 1.6); // adjusted position
        this.mesh.add(noseMesh);

        // Cockpit area
        this.addRecessedCockpit(color);

        // Sidepods - adjusted position
        this.addSidePod(0.9, 0.2, -0.4, color); // adjusted z from -0.5 to -0.4
        this.addSidePod(-0.9, 0.2, -0.4, color);

        // Wheels - adjusted positions
        this.addRoundWheel(0.9, 0, 1.0, true);   // adjusted from 1.2 to 1.0
        this.addRoundWheel(-0.9, 0, 1.0, true);  // adjusted from 1.2 to 1.0
        this.addRoundWheel(0.9, 0, -1.0, false); // adjusted from -1.2 to -1.0
        this.addRoundWheel(-0.9, 0, -1.0, false);// adjusted from -1.2 to -1.0

        // Rest of components with adjusted positions
        this.addEnhancedFrontWing(color);
        this.addRearWing(color);
        this.addAerodynamicDetails(color);

        this.frontWheels = []; // Initialize front wheels array
    }

    private addSidePod(x: number, y: number, z: number, color: string) {
        const podGeometry = new THREE.BoxGeometry(0.3, 0.3, 1.5); // reduced width
        const podMaterial = new THREE.MeshPhongMaterial({ color: color });
        const podMesh = new THREE.Mesh(podGeometry, podMaterial);
        podMesh.position.set(x, y, z);
        this.mesh.add(podMesh);
    }

    private addRoundWheel(x: number, y: number, z: number, isFront: boolean) {
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16); // Increased segments
        const wheelMaterial = new THREE.MeshPhongMaterial({ 
            color: '#111111',
            shininess: 30 // Added shininess for better visibility
        });
        
        const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelMesh.rotation.z = Math.PI / 2;
        
        // Add more visible wheel details
        const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.41, 16);
        const hubMaterial = new THREE.MeshPhongMaterial({ 
            color: '#777777',
            shininess: 50
        });
        const hubMesh = new THREE.Mesh(hubGeometry, hubMaterial);
        hubMesh.rotation.z = Math.PI / 2;
        wheelMesh.add(hubMesh);

        // Add more pronounced spokes
        for (let i = 0; i < 8; i++) {
            const spokeGeometry = new THREE.BoxGeometry(0.08, 0.41, 0.08);
            const spokeMaterial = new THREE.MeshPhongMaterial({ 
                color: '#999999',
                shininess: 50
            });
            const spokeMesh = new THREE.Mesh(spokeGeometry, spokeMaterial);
            spokeMesh.rotation.z = (i * Math.PI) / 4;
            wheelMesh.add(spokeMesh);
        }

        wheelMesh.position.set(x, y + 0.3, z);
        this.mesh.add(wheelMesh);
        this.wheels.push(wheelMesh);
        
        if (isFront) {
            this.frontWheels.push(wheelMesh);
        }
    }

    private addRecessedCockpit(color: string) {
        // Cockpit sides - slightly shorter
        const sideGeometry = new THREE.BoxGeometry(0.2, 0.3, 1.0); // reduced from 1.2 to 1.0
        const sideMaterial = new THREE.MeshPhongMaterial({ color: color });
        
        const leftSide = new THREE.Mesh(sideGeometry, sideMaterial);
        leftSide.position.set(-0.3, 0.45, -0.2);
        this.mesh.add(leftSide);
        
        const rightSide = new THREE.Mesh(sideGeometry, sideMaterial);
        rightSide.position.set(0.3, 0.45, -0.2);
        this.mesh.add(rightSide);

        // Recessed area - slightly shorter
        const recessGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.8); // reduced from 1.0 to 0.8
        const recessMaterial = new THREE.MeshPhongMaterial({ 
            color: '#111111',
            transparent: true,
            opacity: 0.8
        });
        const recessMesh = new THREE.Mesh(recessGeometry, recessMaterial);
        recessMesh.position.set(0, 0.4, -0.2);
        this.mesh.add(recessMesh);

        // Front and back rims - adjusted positions
        const frontRimGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.1);
        const frontRimMesh = new THREE.Mesh(frontRimGeometry, sideMaterial);
        frontRimMesh.position.set(0, 0.45, 0.2); // adjusted from 0.3 to 0.2
        this.mesh.add(frontRimMesh);

        const backRimGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
        const backRimMesh = new THREE.Mesh(backRimGeometry, sideMaterial);
        backRimMesh.position.set(0, 0.45, -0.6); // adjusted from -0.7 to -0.6
        this.mesh.add(backRimMesh);
    }

    private addEnhancedFrontWing(color: string) {
        const wingMaterial = new THREE.MeshPhongMaterial({ color: color });

        // Main front wing - reduced width from 2.2 to 1.8
        const wingGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.2);
        const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
        wingMesh.position.set(0, 0, 2.2);
        this.mesh.add(wingMesh);

        // Wing endplates - adjusted positions inward
        const endplateGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.6);
        const endplateMaterial = new THREE.MeshPhongMaterial({ color: color });
        
        [-0.9, 0.9].forEach(x => { // moved from ±1.1 to ±0.9
            const endplate = new THREE.Mesh(endplateGeometry, endplateMaterial);
            endplate.position.set(x, 0.1, 2.2);
            this.mesh.add(endplate);

            // Add additional aero elements to endplates - adjusted width
            const miniWingGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.3); // reduced from 0.2 to 0.15
            const miniWing = new THREE.Mesh(miniWingGeometry, endplateMaterial);
            miniWing.position.set(x * 0.9, 0.2, 2.4);
            this.mesh.add(miniWing);
        });
    }

    private addRearWing(color: string) {
        const wingMaterial = new THREE.MeshPhongMaterial({ color: color });
        
        // Main plane - adjusted position
        const mainWingGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.3);
        const mainWingMesh = new THREE.Mesh(mainWingGeometry, wingMaterial);
        mainWingMesh.position.set(0, 0.65, -1.5); // adjusted from -1.8 to -1.5
        this.mesh.add(mainWingMesh);

        // DRS flap - adjusted position
        const drsGeometry = new THREE.BoxGeometry(1.4, 0.1, 0.25);
        const drsMesh = new THREE.Mesh(drsGeometry, wingMaterial);
        drsMesh.position.set(0, 0.85, -1.45); // adjusted from -1.75 to -1.45
        this.mesh.add(drsMesh);

        // Wing endplates - adjusted position
        const endplateGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.5);
        const leftPlate = new THREE.Mesh(endplateGeometry, wingMaterial);
        const rightPlate = new THREE.Mesh(endplateGeometry, wingMaterial);
        leftPlate.position.set(-0.8, 0.65, -1.5);  // adjusted z position
        rightPlate.position.set(0.8, 0.65, -1.5);  // adjusted z position
        this.mesh.add(leftPlate);
        this.mesh.add(rightPlate);

        // Support pylons - adjusted position
        const pylonGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.2);
        const pylonMaterial = new THREE.MeshPhongMaterial({ color: color });
        
        const leftPylon = new THREE.Mesh(pylonGeometry, pylonMaterial);
        leftPylon.position.set(-0.3, 0.45, -1.5); // adjusted z position
        this.mesh.add(leftPylon);
        
        const rightPylon = new THREE.Mesh(pylonGeometry, pylonMaterial);
        rightPylon.position.set(0.3, 0.45, -1.5); // adjusted z position
        this.mesh.add(rightPylon);

        // Endplate details - adjusted positions
        this.addEndplateDetails(-0.8, color, -1.5); // added z parameter
        this.addEndplateDetails(0.8, color, -1.5);  // added z parameter
    }

    private addEndplateDetails(x: number, color: string, z: number) {
        const detailMaterial = new THREE.MeshPhongMaterial({ color: color });

        const upperDetailGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.1);
        const upperDetail = new THREE.Mesh(upperDetailGeometry, detailMaterial);
        upperDetail.position.set(x * 0.85, 0.85, z);
        this.mesh.add(upperDetail);

        const lowerDetailGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.1);
        const lowerDetail = new THREE.Mesh(lowerDetailGeometry, detailMaterial);
        lowerDetail.position.set(x * 0.85, 0.7, z);
        this.mesh.add(lowerDetail);

        const verticalDetailGeometry = new THREE.BoxGeometry(0.05, 0.25, 0.1);
        const verticalDetail = new THREE.Mesh(verticalDetailGeometry, detailMaterial);
        verticalDetail.position.set(x * 0.95, 0.775, z);
        this.mesh.add(verticalDetail);
    }

    private addAerodynamicDetails(color: string) {
        // T-wing
        const tWingGeometry = new THREE.BoxGeometry(1, 0.1, 0.2);
        const tWingMaterial = new THREE.MeshPhongMaterial({ color: color });
        const tWingMesh = new THREE.Mesh(tWingGeometry, tWingMaterial);
        tWingMesh.position.set(0, 0.7, -1.4);
        this.mesh.add(tWingMesh);

        // Bargeboard elements
        const bargeboardGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.8);
        const leftBargeboard = new THREE.Mesh(bargeboardGeometry, tWingMaterial);
        const rightBargeboard = new THREE.Mesh(bargeboardGeometry, tWingMaterial);
        leftBargeboard.position.set(-0.7, 0.1, 0.8);
        rightBargeboard.position.set(0.7, 0.1, 0.8);
        this.mesh.add(leftBargeboard);
        this.mesh.add(rightBargeboard);
    }

    public update(controls: Controls): void {
        // Update velocity based on controls
        if (controls.forward) {
            this.acceleration = 0.008; // Increased for more responsive acceleration
        } else if (controls.backward) {
            this.acceleration = -0.008;
        } else {
            this.acceleration = 0;
        }

        // Apply acceleration and friction
        this.velocity += this.acceleration;
        this.velocity *= this.friction;

        // Apply brakes
        if (controls.brake) {
            this.velocity *= 0.9;
        }

        // Clamp velocity
        this.velocity = Math.max(Math.min(this.velocity, this.maxSpeed), -this.maxSpeed * 0.5);

        // Update position and rotation
        if (Math.abs(this.velocity) > 0.001) {
            const moveAngle = this.mesh.rotation.y;
            const moveX = Math.sin(moveAngle) * this.velocity;
            const moveZ = Math.cos(moveAngle) * this.velocity;
            
            this.mesh.position.x -= moveX;
            this.mesh.position.z -= moveZ;

            // Update wheel rotation for forward movement
            const wheelRotationSpeed = -this.velocity * 10;
            this.wheels.forEach(wheel => {
                wheel.rotation.x += wheelRotationSpeed;
                wheel.children.forEach(child => {
                    child.rotation.x += wheelRotationSpeed;
                });
            });
        }

        // Handle turning
        if (Math.abs(this.velocity) > 0.001) {
            let targetWheelAngle = 0;
            
            if (controls.left) {
                this.mesh.rotation.y += this.turnSpeed * Math.abs(this.velocity);
                targetWheelAngle = this.maxWheelTurn;
            } else if (controls.right) {
                this.mesh.rotation.y -= this.turnSpeed * Math.abs(this.velocity);
                targetWheelAngle = -this.maxWheelTurn;
            }

            // Smoothly rotate front wheels for steering
            this.frontWheels.forEach(wheel => {
                // Reset wheel rotation when not turning
                if (!controls.left && !controls.right) {
                    targetWheelAngle = 0;
                }

                // Smoothly interpolate current wheel rotation to target angle
                const currentRotation = wheel.rotation.y;
                const rotationDiff = targetWheelAngle - currentRotation;
                wheel.rotation.y += rotationDiff * 0.2; // Smooth transition
            });
        } else {
            // Reset wheel rotation when stationary
            this.frontWheels.forEach(wheel => {
                wheel.rotation.y *= 0.9; // Smoothly return to center
            });
        }
    }
} 