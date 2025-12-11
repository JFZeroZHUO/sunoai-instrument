document.addEventListener('DOMContentLoaded', function() {
    // Select both types of cards
    const cards = document.querySelectorAll('.card, .prompt-card');
    let metadata = {};
    let activeFileInput = null; 

    // --- Modal Logic Start ---
    // Inject Styles for Modal
    const style = document.createElement('style');
    style.textContent = `
        .nickname-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s;
        }
        .nickname-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .nickname-modal {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            width: 90%;
            max-width: 400px;
            text-align: center;
        }
        .nickname-modal h3 {
            margin-top: 0;
            color: #333;
            margin-bottom: 15px;
        }
        .nickname-modal input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 16px;
            box-sizing: border-box; 
        }
        .nickname-modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        .nickname-modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
        }
        .nickname-modal-cancel {
            background: #f1f5f9;
            color: #64748b;
        }
        .nickname-modal-cancel:hover {
            background: #e2e8f0;
        }
        .nickname-modal-confirm {
            background: #4f46e5;
            color: white;
        }
        .nickname-modal-confirm:hover {
            background: #4338ca;
        }
        
        /* New Style for Uploaded Cards */
        .card-uploaded {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
            border-color: #fdba74 !important;
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.15) !important;
            transition: all 0.5s ease;
        }
    `;
    document.head.appendChild(style);

    // Create Modal HTML
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'nickname-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="nickname-modal">
            <h3>Enter Your Nickname<br><span style="font-size: 0.8em; color: #666; font-weight: normal;">请输入您的昵称</span></h3>
            <p style="font-size: 0.9em; color: #666; margin-bottom: 15px; text-align: left;">
                To credit your contribution, please enter your name before selecting the file.
                <br>为了标记您的贡献，请在选择文件前输入您的名字。
            </p>
            <input type="text" id="nickname-input" placeholder="Nickname / 昵称 (e.g., MusicLover)" />
            <div class="nickname-modal-buttons">
                <button class="nickname-modal-btn nickname-modal-cancel">Cancel / 取消</button>
                <button class="nickname-modal-btn nickname-modal-confirm">Next / 下一步</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Modal Elements
    const nicknameInput = modalOverlay.querySelector('#nickname-input');
    const cancelBtn = modalOverlay.querySelector('.nickname-modal-cancel');
    const confirmBtn = modalOverlay.querySelector('.nickname-modal-confirm');

    // Modal Functions
    function showModal(fileInput) {
        activeFileInput = fileInput;
        // Pre-fill with previous nickname if available
        const storedName = localStorage.getItem('contributor_nickname');
        if (storedName) {
            nicknameInput.value = storedName;
        }
        modalOverlay.classList.add('active');
        setTimeout(() => nicknameInput.focus(), 100);
    }

    function hideModal() {
        modalOverlay.classList.remove('active');
        activeFileInput = null;
    }

    function handleConfirm() {
        const nickname = nicknameInput.value.trim() || 'Anonymous';
        localStorage.setItem('contributor_nickname', nickname); // Remember for next time
        
        if (activeFileInput) {
            activeFileInput.dataset.nickname = nickname;
            activeFileInput.click(); // Trigger file selection
        }
        hideModal();
    }

    // Modal Event Listeners
    cancelBtn.addEventListener('click', hideModal);
    confirmBtn.addEventListener('click', handleConfirm);
    nicknameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConfirm();
    });
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) hideModal();
    });
    // --- Modal Logic End ---

    // Function to render contributor info
    function renderContributor(container, nickname) {
        let contributorDiv = container.querySelector('.contributor-info');
        if (!contributorDiv) {
            contributorDiv = document.createElement('div');
            contributorDiv.className = 'contributor-info';
            contributorDiv.style.fontSize = '0.85em';
            contributorDiv.style.color = '#64748b';
            contributorDiv.style.marginTop = '8px';
            contributorDiv.style.textAlign = 'center';
            contributorDiv.style.fontStyle = 'italic';
            container.appendChild(contributorDiv);
        }
        contributorDiv.innerHTML = `Contributor / 贡献者: <strong>${nickname}</strong>`;
        
        // Add visual cue to the card
        const card = container.closest('.card') || container.closest('.prompt-card');
        if (card) {
            card.classList.add('card-uploaded');
        }
    }

    // Function to update audio player
    function updateAudioPlayer(container, filePath, fileType) {
        const card = container.closest('.card') || container.closest('.prompt-card');
        const audioPlayer = card.querySelector('audio');
        if (audioPlayer) {
            let source = audioPlayer.querySelector('source');
            if (!source) {
                source = document.createElement('source');
                source.type = fileType || 'audio/mpeg'; 
                audioPlayer.appendChild(source);
            }
            source.src = filePath;
            source.type = fileType || 'audio/mpeg';
            audioPlayer.load();
        }
    }

    // Load existing metadata
    fetch('/api/metadata')
        .then(response => response.json())
        .then(data => {
            metadata = data;
            // Apply metadata to existing cards
            cards.forEach(card => {
                const keyElement = card.querySelector('.card-en') || card.querySelector('.desc-en');
                if (keyElement) {
                    const key = keyElement.textContent.trim();
                    if (metadata[key]) {
                        const actionRow = card.querySelector('.action-row');
                        const copyBtn = card.querySelector('.copy-btn');
                        let targetContainer = actionRow;
                        if (!targetContainer && copyBtn) {
                            targetContainer = copyBtn.parentNode;
                        }

                        if (targetContainer) {
                            renderContributor(targetContainer, metadata[key].contributor);
                            updateAudioPlayer(targetContainer, metadata[key].filePath);
                        }
                    }
                }
            });
        })
        .catch(err => console.error('Error loading metadata:', err));

    
    cards.forEach((card, index) => {
        const actionRow = card.querySelector('.action-row');
        const copyBtn = card.querySelector('.copy-btn');
        let targetContainer = actionRow;

        if (!targetContainer && copyBtn) {
            targetContainer = copyBtn.parentNode;
        }

        if (!targetContainer) return;

        // Check if upload controls already exist
        if (targetContainer.querySelector('.upload-btn')) return;

        // Create wrapper for buttons
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.gap = '10px';
        buttonWrapper.style.marginTop = '10px';
        buttonWrapper.style.width = '100%';

        if (copyBtn && copyBtn.parentNode === targetContainer) {
            copyBtn.style.marginTop = '0';
            copyBtn.style.flex = '1';
            buttonWrapper.appendChild(copyBtn);
        }

        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.style.display = 'none';
        fileInput.id = `upload-input-${index}`;
        
        // Create upload button
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'copy-btn upload-btn'; 
        uploadBtn.innerHTML = '📤 Upload / 上传';
        uploadBtn.style.marginTop = '0';
        uploadBtn.style.backgroundColor = '#e0e7ff';
        uploadBtn.style.color = '#4338ca'; 
        uploadBtn.style.border = '1px dashed #4338ca';
        uploadBtn.style.flex = '1';

        buttonWrapper.appendChild(uploadBtn);
        
        targetContainer.appendChild(fileInput);
        targetContainer.appendChild(buttonWrapper);

        // Event listeners
        uploadBtn.addEventListener('click', () => {
            showModal(fileInput);
        });

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('audio/')) {
                alert('请上传有效的音频文件！\nPlease upload a valid audio file.');
                fileInput.value = '';
                return;
            }

            const nickname = fileInput.dataset.nickname || 'Anonymous';
            
            const keyElement = card.querySelector('.card-en') || card.querySelector('.desc-en');
            const promptKey = keyElement ? keyElement.textContent.trim() : '';

            const formData = new FormData();
            formData.append('audioFile', file);
            formData.append('contributor', nickname);
            formData.append('promptKey', promptKey);

            const originalText = uploadBtn.innerHTML;
            uploadBtn.innerHTML = '⏳ Uploading...';
            uploadBtn.disabled = true;
            uploadBtn.style.cursor = 'wait';

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                
                updateAudioPlayer(targetContainer, data.filePath, file.type);
                renderContributor(targetContainer, data.contributor);
                
                alert(`上传成功！感谢 ${data.contributor} 的贡献！\nUpload Successful! Thank you ${data.contributor}!`);

            } catch (error) {
                console.error('Error:', error);
                alert('上传失败，请重试。\nUpload failed, please try again.');
            } finally {
                uploadBtn.innerHTML = originalText;
                uploadBtn.disabled = false;
                uploadBtn.style.cursor = 'pointer';
                fileInput.value = '';
            }
        });
    });
});
