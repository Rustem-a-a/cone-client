import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

interface IParameters {
    apex: {
        x: number
        y: number
        z: number
    }
    coordinates: {
        x: number
        y: number
        z: number
    }[]
}

export default function createCone(renderer: THREE.WebGLRenderer, coordinates: IParameters, notFirstRender: boolean, rotation: boolean) {

    const container = document.getElementById("scene-container") as HTMLElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 78;
    camera.position.x = 0
    camera.position.y = -90
    // const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    if (notFirstRender) {
        container.replaceChildren()
    }
    container.appendChild(renderer.domElement);

    const vertex = new THREE.Vector3(coordinates.apex.x, coordinates.apex.y, coordinates.apex.z);
    const basePoints = [];
    for (let i = 0; i < coordinates.coordinates.length; i++) {
        basePoints.push(new THREE.Vector3(coordinates.coordinates[i].x, coordinates.coordinates[i].y, coordinates.coordinates[i].z));
    }
    const vertices = [];
    for (const point of basePoints) {
        vertices.push(point.x, point.y, point.z);
    }
    vertices.push(vertex.x, vertex.y, vertex.z);

    const indices = [];
    for (let i = 0; i < basePoints.length; i++) {
        indices.push(i, (i + 1) % basePoints.length, basePoints.length);
    }
    for (let i = 0; i < basePoints.length; i++) {
        indices.push((i + 1) % basePoints.length, i, basePoints.length + 1);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    const cone = new THREE.Mesh(geometry, material);
    cone.position.copy(vertex);
    const coneGroup = new THREE.Group();
    coneGroup.add(cone);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    for (let i = 0; i < edgesGeometry.attributes.position.array.length; i++) {
        const value = edgesGeometry.attributes.position.array[i];
        if (isNaN(value)) {
            edgesGeometry.attributes.position.array[i] = 0;
        };
    };
    const edgesMaterial = new THREE.LineBasicMaterial({color: 0x000000});
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    edges.position.copy(cone.position);
    coneGroup.add(edges);
    coneGroup.position.y = -30;
    scene.add(coneGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    function animate() {
        requestAnimationFrame(animate);
        if (rotation) {
            coneGroup.rotation.x += 0.01;
            coneGroup.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    }
    animate();
}