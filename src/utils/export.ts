import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export function save(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
}

export function saveArrayBuffer(buffer: BlobPart, filename: string) {
    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

export function saveString(text: string, filename: string) {
    save(new Blob([text], { type: 'text/plain;charset=utf-8' }), filename);
}

export function createScene(vertices: number[], indices: number[]) {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshMatcapMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    const scene = new THREE.Scene();

    scene.add(mesh);

    return scene;
}

export function exportToGLTF(vertices: number[], indices: number[], binary: boolean = true) {
    const exporter = new GLTFExporter();
    const scene = createScene(vertices, indices);

    exporter.parse(
        scene,
        function (result) {
            if (result instanceof ArrayBuffer) {
                saveArrayBuffer(result, 'scene.glb');
            } else {
                const output = JSON.stringify(result, null, 2);
                saveString(output, 'scene.gltf');
            }
        },
        function (error) { console.log('An error occurred during parse:', error); },
        { binary }
    );
}