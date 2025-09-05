document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('myCheckbox');
    const statusText = document.getElementById('statusText');
    const counter = document.getElementById('counter');
    const statusDiv = document.querySelector('.status');
    const syncText = document.getElementById('syncText');
    const syncSlider = document.getElementById('syncSlider');
    const sliderValue = document.getElementById('sliderValue');
    
    let toggleCount = 0;
    let isUpdatingFromSync = false;
    let lastUpdateTimestamp = 0;
    let sliderUpdateTimeout;
    
    // Function to update status
    function updateStatus(fromSync = false) {
        const isChecked = checkbox.checked;
        statusText.textContent = isChecked ? 'checked' : 'unchecked';
        statusText.style.color = isChecked ? '#28a745' : '#667eea';
        
        // Add animation effect
        statusDiv.classList.add('status-change');
        setTimeout(() => {
            statusDiv.classList.remove('status-change');
        }, 300);
        
        // Update counter only if not from sync (to avoid double counting)
        if (!fromSync) {
            toggleCount++;
            counter.textContent = toggleCount;
            
            // Sync state across all browsers using localStorage
            syncStateAcrossBrowsers(isChecked, toggleCount);
        }
        
        // Log to console for BrowserSync testing
        console.log(`Checkbox is now ${isChecked ? 'checked' : 'unchecked'} - Toggle count: ${toggleCount} ${fromSync ? '(synced)' : ''}`);
    }
    
    // Function to sync state across browsers using localStorage and storage events
    function syncStateAcrossBrowsers(isChecked, count, sliderVal = null) {
        const syncData = {
            checked: isChecked,
            count: count,
            sliderValue: sliderVal !== null ? sliderVal : parseInt(syncSlider.value),
            timestamp: Date.now()
        };
        localStorage.setItem('checkboxSync', JSON.stringify(syncData));
    }
    
    // Listen for storage events to sync across browser tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'checkboxSync' && e.newValue) {
            try {
                const syncData = JSON.parse(e.newValue);
                isUpdatingFromSync = true;
                
                checkbox.checked = syncData.checked;
                toggleCount = syncData.count;
                counter.textContent = toggleCount;
                
                // Update slider if value exists in sync data
                if (syncData.sliderValue !== undefined) {
                    syncSlider.value = syncData.sliderValue;
                    sliderValue.textContent = syncData.sliderValue;
                    updateSliderDisplay(true);
                }
                
                updateStatus(true);
                isUpdatingFromSync = false;
            } catch (error) {
                console.error('Error parsing sync data:', error);
            }
        }
    });
    
    // BrowserSync socket connection for real-time sync across different browsers
    if (typeof window.___browserSync___ !== 'undefined') {
        console.log('BrowserSync detected - enabling cross-browser sync');
        syncText.textContent = 'Active (Cross-browser)';
        syncText.className = 'sync-active';
        
        // Listen for custom sync events from the injected script
        window.addEventListener('checkbox:sync', function(event) {
            const data = event.detail;
            if (!isUpdatingFromSync && data.timestamp !== lastUpdateTimestamp) {
                isUpdatingFromSync = true;
                checkbox.checked = data.checked;
                toggleCount = data.count;
                counter.textContent = toggleCount;
                
                // Update slider if value exists in sync data
                if (data.sliderValue !== undefined) {
                    syncSlider.value = data.sliderValue;
                    sliderValue.textContent = data.sliderValue;
                    updateSliderDisplay(true);
                }
                
                updateStatus(true);
                lastUpdateTimestamp = data.timestamp;
                isUpdatingFromSync = false;
            }
        });
        
        // Send updates to other browsers
        function broadcastUpdate(isChecked, count, sliderVal = null) {
            const data = {
                checked: isChecked,
                count: count,
                sliderValue: sliderVal !== null ? sliderVal : parseInt(syncSlider.value),
                timestamp: Date.now()
            };
            if (window.broadcastCheckboxUpdate) {
                window.broadcastCheckboxUpdate(data);
            }
            lastUpdateTimestamp = data.timestamp;
        }
        
        // Override the sync function to use BrowserSync
        syncStateAcrossBrowsers = function(isChecked, count, sliderVal = null) {
            broadcastUpdate(isChecked, count, sliderVal);
            // Also update localStorage as fallback
            const syncData = {
                checked: isChecked,
                count: count,
                sliderValue: sliderVal !== null ? sliderVal : parseInt(syncSlider.value),
                timestamp: Date.now()
            };
            localStorage.setItem('checkboxSync', JSON.stringify(syncData));
        };
    } else {
        console.log('BrowserSync not detected - using localStorage sync only');
        syncText.textContent = 'Local only';
        syncText.className = 'sync-inactive';
    }
    
    // Load initial state from localStorage if available
    try {
        const savedState = localStorage.getItem('checkboxSync');
        if (savedState) {
            const syncData = JSON.parse(savedState);
            checkbox.checked = syncData.checked;
            toggleCount = syncData.count;
            counter.textContent = toggleCount;
            updateStatus(true);
            
            // Update slider if value exists in sync data
            if (syncData.sliderValue !== undefined) {
                syncSlider.value = syncData.sliderValue;
                sliderValue.textContent = syncData.sliderValue;
                updateSliderDisplay(true);
            }
        }
    } catch (error) {
        console.error('Error loading saved state:', error);
    }
    
    // Add event listener to checkbox
    checkbox.addEventListener('change', function() {
        if (!isUpdatingFromSync) {
            updateStatus();
        }
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && event.target === document.body && !isUpdatingFromSync) {
            event.preventDefault();
            checkbox.checked = !checkbox.checked;
            updateStatus();
        }
    });
    
    // Add some visual feedback on load
    console.log('BrowserSync Checkbox Project loaded successfully with cross-browser sync!');
    
    // Slider functionality
    function updateSliderDisplay(fromSync = false) {
        const value = syncSlider.value;
        sliderValue.textContent = value;
        
        // Add visual feedback for sync updates
        if (fromSync) {
            sliderValue.parentElement.classList.add('slider-sync-update');
            setTimeout(() => {
                sliderValue.parentElement.classList.remove('slider-sync-update');
            }, 400);
        }
        
        console.log(`Slider value: ${value}% ${fromSync ? '(synced)' : ''}`);
    }
    
    // Debounced slider sync function to avoid too many updates
    function syncSliderValue() {
        clearTimeout(sliderUpdateTimeout);
        sliderUpdateTimeout = setTimeout(() => {
            if (!isUpdatingFromSync) {
                const value = parseInt(syncSlider.value);
                syncStateAcrossBrowsers(checkbox.checked, toggleCount, value);
            }
        }, 100); // 100ms debounce
    }
    
    // Add slider event listeners
    syncSlider.addEventListener('input', function() {
        updateSliderDisplay();
        syncSliderValue();
    });
    
    // Initialize slider display
    updateSliderDisplay();
});
