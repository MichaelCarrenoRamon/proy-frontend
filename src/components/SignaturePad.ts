export class SignaturePadComponent {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isDrawing = false;
    private lastX = 0;
    private lastY = 0;
  
    constructor(canvasId: string) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.setupCanvas();
      this.setupEventListeners();
    }
  
    private setupCanvas() {
      // Configurar tamaño del canvas
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
  
      // Configurar estilo de dibujo
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  
    private setupEventListeners() {
      // Mouse events
      this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
      this.canvas.addEventListener('mousemove', this.draw.bind(this));
      this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
      this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
  
      // Touch events para tablet
      this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
      this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
      this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    }
  
    private startDrawing(e: MouseEvent) {
      this.isDrawing = true;
      const rect = this.canvas.getBoundingClientRect();
      this.lastX = e.clientX - rect.left;
      this.lastY = e.clientY - rect.top;
    }
  
    private draw(e: MouseEvent) {
      if (!this.isDrawing) return;
  
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
  
      this.lastX = x;
      this.lastY = y;
    }
  
    private stopDrawing() {
      this.isDrawing = false;
    }
  
    private handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.isDrawing = true;
      this.lastX = touch.clientX - rect.left;
      this.lastY = touch.clientY - rect.top;
    }
  
    private handleTouchMove(e: TouchEvent) {
      if (!this.isDrawing) return;
      e.preventDefault();
  
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
  
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
  
      this.lastX = x;
      this.lastY = y;
    }
  
    public clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    public isEmpty(): boolean {
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      return !imageData.data.some(channel => channel !== 0);
    }
  
    public getDataURL(): string {
      return this.canvas.toDataURL('image/png');
    }
  }