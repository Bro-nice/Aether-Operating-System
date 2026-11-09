export interface AssistantResponse {
  reply: string;
  action: string;
  target?: string;
  data?: any;
}

export async function queryOSAssistant(
  prompt: string,
  systemState: any = {}
): Promise<AssistantResponse> {
  try {
    const res = await fetch('/api/os/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemState }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('OS Assistant fallback:', error);
    const query = prompt.toLowerCase();
    if (query.includes('camera') || query.includes('photo')) {
      return { reply: 'Opening Camera application.', action: 'OPEN_APP', target: 'camera' };
    }
    if (query.includes('phone') || query.includes('call')) {
      return { reply: 'Opening Phone dialer.', action: 'OPEN_APP', target: 'phone' };
    }
    if (query.includes('setting') || query.includes('wifi')) {
      return { reply: 'Opening System Settings.', action: 'OPEN_APP', target: 'settings' };
    }
    if (query.includes('torch') || query.includes('flashlight')) {
      return { reply: 'Toggling torch status.', action: 'TOGGLE_FLASHLIGHT' };
    }
    return {
      reply: `Processing "${prompt}". How else can I assist your system workflow?`,
      action: 'NONE',
    };
  }
}
