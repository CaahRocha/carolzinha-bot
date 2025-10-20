import { GroupMetadata, proto } from "baileys";

declare global {
  /** Caminho base do projeto, usado para imports. */
  const BASE_DIR: string;


  interface CommandHandleProps {

    args: string[];

  
    commandName: string;

    
    fullArgs: string;

    
    fullMessage: string;

   
    isAudio: boolean;

    isGroup: boolean;

    
    isGroupWithLid: boolean;

    
    isImage: boolean;

    
    isReply: boolean;

    isSticker: boolean;

    isVideo: boolean;

    
    prefix: string;

    remoteJid: string;

    replyJid: string;

    socket: any;

    startProcess?: number;

   
    type?: string;

    
    userJid: string;

    webMessage: any;

    /**
    
     * @param key Chave de identificação da mensagem a ser deletada.
     */
    deleteMessage(key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
      participant: string;
    }): Promise<void>;

    /**
     * Faz download de um áudio da mensagem atual.
     * @returns Promise com o caminho do áudio
     */
    downloadAudio(): Promise<string>;

    /**
     * Faz download de uma imagem da mensagem atual.
     * @returns Promise com o caminho da imagem
     */
    downloadImage(): Promise<string>;

    /**
     * Faz download de um sticker da mensagem atual.
     * @returns Promise com o caminho do sticker
     */
    downloadSticker(): Promise<string>;

    /**
     * Faz download de um vídeo da mensagem atual.
     * @returns Promise com o caminho do vídeo
     */
    downloadVideo(): Promise<string>;

    /**

     * ```
     * @param filePath Caminho do arquivo
     * @param asVoice Se o áudio deve ser enviado como mensagem de voz (true ou false)
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendAudioFromFile(
      filePath: string,
      asVoice: boolean,
      quoted: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
   
     * @param buffer Buffer do arquivo de áudio
     * @param asVoice Se o áudio deve ser enviado como mensagem de voz (true ou false)
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendAudioFromBuffer(
      buffer: Buffer,
      asVoice: boolean,
      quoted: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * @param url URL do áudio a ser enviado
     * @param asVoice Se o áudio deve ser enviado como mensagem de voz (true ou false)
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendAudioFromURL(
      url: string,
      asVoice: boolean,
      quoted: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * @param phoneNumber Número de telefone do contato (formato internacional, ex: "5511920202020")
     * @param displayName Nome do contato a ser exibido
     */
    sendContact(phoneNumber: string, displayName: string): Promise<void>;

    /**
    
     * ```
     * @param text Texto da mensagem
     * @param messageToEdit Mensagem a ser editada
     * @param mentions Array opcional de IDs de usuários para mencionar
     */
    sendEditedReply(
      text: string,
      messageToEdit: proto.WebMessageInfo,
      mentions?: string[]
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * ```
     * @param text Texto da mensagem
     * @param messageToEdit Mensagem a ser editada
     * @param mentions Array opcional de IDs de usuários para mencionar
     */
    sendEditedText(
      text: string,
      messageToEdit: proto.WebMessageInfo,
      mentions?: string[]
    ): Promise<proto.WebMessageInfo>;

    /**
   
     * ```
     * @param file Caminho do arquivo no servidor
     * @param caption Texto da mensagem (opcional)
     * @param mentions Array opcional de JIDs de usuários para mencionar
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendGifFromFile(
      file: string,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * @param url URL do gif a ser enviado
     * @param caption Texto da mensagem (opcional)
     * @param mentions Array opcional de JIDs de usuários para mencionar
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendGifFromURL(
      url: string,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * @param buffer Buffer do gif
     * @param caption Texto da mensagem (opcional)
     * @param mentions Array opcional de JIDs de usuários para mencionar
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendGifFromBuffer(
      buffer: Buffer,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
 
     * ```
     * @param file Caminho do arquivo no servidor
     * @param caption Texto da mensagem (opcional)
     * @param mentions Array opcional de JIDs de usuários para mencionar
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendImageFromFile(
      file: string,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * @param buffer Buffer da imagem
     * @param caption Texto da mensagem (opcional)
     * @param mentions Array opcional de JIDs de usuários para mencionar
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendImageFromBuffer(
      buffer: Buffer,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     * ```
     * @param url URL da imagem a ser enviada
     * @param caption Texto da mensagem (opcional)
     * @param mentions Array opcional de JIDs de usuários para mencionar
     * @param quoted Se a mensagem deve ser enviada mencionando outra mensagem (true ou false)
     */
    sendImageFromURL(
      url: string,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    /**
     
     * @param latitude Latitude da localização
     * @param longitude Longitude da localização
     */
    sendLocation(latitude: number, longitude: number): Promise<void>;

    /**
     
 
     * @param emoji Emoji para reagir
     */
    sendReact(emoji: string): Promise<proto.WebMessageInfo>;

    /**
     * Simula uma ação de gravação de áudio, enviando uma mensagem de estado.
     *
     * @param anotherJid ID de outro grupo/usuário para enviar o estado (opcional)
     */
    sendRecordState(anotherJid?: string): Promise<void>;

    sendSuccessReact(): Promise<proto.WebMessageInfo>;

    sendTypingState(anotherJid?: string): Promise<void>;

    sendWaitReact(): Promise<proto.WebMessageInfo>;

    sendWarningReact(): Promise<proto.WebMessageInfo>;

    sendErrorReact(): Promise<proto.WebMessageInfo>;

  
    sendReply(text: string, mentions?: string[]): Promise<proto.WebMessageInfo>;

    sendSuccessReply(
      text: string,
      mentions?: string[]
    ): Promise<proto.WebMessageInfo>;

    sendWarningReply(
      text: string,
      mentions?: string[]
    ): Promise<proto.WebMessageInfo>;

  
    sendWaitReply(
      text: string,
      mentions?: string[]
    ): Promise<proto.WebMessageInfo>;

    sendErrorReply(
      text: string,
      mentions?: string[]
    ): Promise<proto.WebMessageInfo>;

    sendStickerFromFile(
      path: string,
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;


    sendStickerFromURL(
      url: string,
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    sendVideoFromFile(
      file: string,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    sendVideoFromURL(
      url: string,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;


    sendVideoFromBuffer(
      buffer: Buffer,
      caption?: string,
      mentions?: string[],
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

 
    sendDocumentFromURL(
      url: string,
      mimetype?: string,
      fileName?: string,
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

    sendDocumentFromBuffer(
      buffer: Buffer,
      mimetype?: string,
      fileName?: string,
      quoted?: boolean
    ): Promise<proto.WebMessageInfo>;

  
    getGroupMetadata(jid?: string): Promise<GroupMetadata | null>;

 
    getGroupName(groupJid?: string): Promise<string>;

    getGroupOwner(groupJid?: string): Promise<string>;

    getGroupParticipants(groupJid?: string): Promise<any[]>;

  
    getGroupAdmins(groupJid?: string): Promise<string[]>;

    sendPoll(
      title: string,
      options: { optionName: string }[],
      singleChoice?: boolean
    ): Promise<proto.WebMessageInfo>;
  }
}

export {};
