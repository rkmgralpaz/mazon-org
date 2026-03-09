<?php
/**
 * Postcards Review — Admin page to review postcard alt texts
 * Renders full interface (inline HTML/CSS/JS)
 */

if (!defined('ABSPATH')) exit;

function render_postcards_review() {
    $theme_dir = get_template_directory();
    $postcards_dir = $theme_dir . '/postcards-wall';

    // Read data
    $alts_file = $postcards_dir . '/postcards-alts.json';
    $report_file = $postcards_dir . '/verification-report.json';

    $alts_json = file_exists($alts_file) ? file_get_contents($alts_file) : '{}';
    $report_json = file_exists($report_file) ? file_get_contents($report_file) : '{}';

    $alts = json_decode($alts_json, true) ?: [];
    $report = json_decode($report_json, true) ?: [];

    // Count those needing review
    $needs_review_count = 0;
    foreach ($report as $entry) {
        if (isset($entry['status']) && $entry['status'] === 'needs_review') {
            $needs_review_count++;
        }
    }
    $total = count($alts);

    // Base URL for images
    $images_url = get_template_directory_uri() . '/postcards-wall/postcards/Selects/';

    // Nonce for AJAX
    $nonce = wp_create_nonce('postcards_review_nonce');
    ?>
    <div class="wrap" id="postcards-review-app">
        <h1>Postcards Review</h1>

        <div id="pr-toolbar">
            <div id="pr-counter">
                <strong id="pr-review-count"><?php echo $needs_review_count; ?></strong> of <?php echo $total; ?> need review
            </div>
            <div id="pr-filters">
                <button type="button" class="button pr-filter-btn active" data-filter="all">All</button>
                <button type="button" class="button pr-filter-btn" data-filter="needs_review">Needs review only</button>
                <button type="button" class="button pr-filter-btn" data-filter="ok">OK only</button>
            </div>
        </div>

        <div id="pr-cards-list">
            <?php
            foreach ($alts as $filename => $alt_text) :
                $entry = isset($report[$filename]) ? $report[$filename] : null;
                $status = $entry && isset($entry['status']) ? $entry['status'] : 'ok';
                $card_class = $status === 'needs_review' ? 'pr-card needs-review' : 'pr-card';
                $number = str_replace(['postcard-', '.webp'], '', $filename);
            ?>
            <div class="<?php echo $card_class; ?>" data-filename="<?php echo esc_attr($filename); ?>" data-status="<?php echo esc_attr($status); ?>">
                <div class="pr-card-header">
                    <span class="pr-card-number">#<?php echo $number; ?></span>
                    <span class="pr-card-filename"><?php echo esc_html($filename); ?></span>
                    <?php if ($status === 'needs_review') : ?>
                        <span class="pr-badge-review">Needs review</span>
                    <?php else : ?>
                        <span class="pr-badge-ok">OK</span>
                    <?php endif; ?>
                </div>

                <div class="pr-card-body">
                    <div class="pr-card-image">
                        <img
                            src="<?php echo esc_url($images_url . $filename); ?>"
                            alt="<?php echo esc_attr($filename); ?>"
                            loading="lazy"
                            class="pr-img-thumb"
                        />
                    </div>

                    <div class="pr-card-content">
                        <div class="pr-textarea-wrap">
                            <label>Alt text:</label>
                            <textarea class="pr-alt-textarea" rows="4"><?php echo esc_textarea($alt_text); ?></textarea>
                        </div>

                        <div class="pr-card-actions">
                            <button type="button" class="button button-primary pr-save-btn">Save</button>
                            <span class="pr-save-status"></span>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Lightbox -->
        <div id="pr-lightbox" style="display:none;">
            <div id="pr-lightbox-overlay"></div>
            <div id="pr-lightbox-content">
                <img id="pr-lightbox-img" src="" alt="" />
                <button type="button" id="pr-lightbox-close">&times;</button>
            </div>
        </div>
    </div>

    <style>
        /* Toolbar */
        #pr-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 15px 0;
            padding: 12px 16px;
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
        }
        #pr-counter {
            font-size: 14px;
        }
        #pr-counter strong {
            color: #d63638;
            font-size: 18px;
        }
        #pr-filters {
            display: flex;
            gap: 8px;
        }
        .pr-filter-btn.active {
            background: #2271b1;
            color: #fff;
            border-color: #2271b1;
        }

        /* Cards */
        #pr-cards-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .pr-card {
            background: #fff;
            border: 2px solid #ccd0d4;
            border-radius: 6px;
            overflow: hidden;
            transition: border-color 0.3s;
        }
        .pr-card.needs-review {
            border-color: #d63638;
        }
        .pr-card.saved-flash {
            border-color: #00a32a !important;
            box-shadow: 0 0 0 2px rgba(0,163,42,0.3);
        }
        .pr-card.hidden-by-filter {
            display: none;
        }

        /* Card header */
        .pr-card-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 16px;
            background: #f6f7f7;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }
        .pr-card-number {
            font-weight: 700;
            font-size: 15px;
            color: #1d2327;
        }
        .pr-card-filename {
            color: #787c82;
            font-family: monospace;
        }
        .pr-badge-review {
            background: #d63638;
            color: #fff;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .pr-badge-ok {
            background: #00a32a;
            color: #fff;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        /* Card body */
        .pr-card-body {
            display: flex;
            gap: 20px;
            padding: 16px;
        }
        .pr-card-image {
            flex: 0 0 500px;
            max-width: 500px;
        }
        .pr-img-thumb {
            width: 100%;
            height: auto;
            display: block;
            cursor: zoom-in;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .pr-card-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* Textarea */
        .pr-textarea-wrap {
            flex: 1;
        }
        .pr-textarea-wrap label {
            display: block;
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 13px;
        }
        .pr-alt-textarea {
            width: 100%;
            min-height: 100px;
            font-size: 13px;
            font-family: monospace;
            resize: vertical;
            box-sizing: border-box;
        }

        /* Actions */
        .pr-card-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .pr-save-status {
            font-size: 13px;
            font-weight: 600;
        }
        .pr-save-status.success {
            color: #00a32a;
        }
        .pr-save-status.error {
            color: #d63638;
        }

        /* Lightbox */
        #pr-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100000;
        }
        #pr-lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
        }
        #pr-lightbox-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
        }
        #pr-lightbox-img {
            max-width: 90vw;
            max-height: 90vh;
            display: block;
            border-radius: 4px;
        }
        #pr-lightbox-close {
            position: absolute;
            top: -15px;
            right: -15px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #fff;
            border: none;
            font-size: 22px;
            line-height: 36px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: #1d2327;
        }
        #pr-lightbox-close:hover {
            background: #d63638;
            color: #fff;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .pr-card-image {
                flex: 0 0 350px;
                max-width: 350px;
            }
        }
        @media (max-width: 900px) {
            .pr-card-body {
                flex-direction: column;
            }
            .pr-card-image {
                flex: none;
                max-width: 100%;
            }
        }
    </style>

    <script>
    (function() {
        var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';
        var nonce = '<?php echo $nonce; ?>';

        // Filtros
        document.querySelectorAll('.pr-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.pr-filter-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var filter = btn.getAttribute('data-filter');
                document.querySelectorAll('.pr-card').forEach(function(card) {
                    if (filter === 'all') {
                        card.classList.remove('hidden-by-filter');
                    } else if (filter === 'needs_review') {
                        card.classList.toggle('hidden-by-filter', card.getAttribute('data-status') !== 'needs_review');
                    } else if (filter === 'ok') {
                        card.classList.toggle('hidden-by-filter', card.getAttribute('data-status') !== 'ok');
                    }
                });
            });
        });

        // Lightbox
        document.querySelectorAll('.pr-img-thumb').forEach(function(img) {
            img.addEventListener('click', function() {
                var lb = document.getElementById('pr-lightbox');
                document.getElementById('pr-lightbox-img').src = img.src;
                lb.style.display = 'block';
            });
        });
        document.getElementById('pr-lightbox-overlay').addEventListener('click', closeLightbox);
        document.getElementById('pr-lightbox-close').addEventListener('click', closeLightbox);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeLightbox();
        });
        function closeLightbox() {
            document.getElementById('pr-lightbox').style.display = 'none';
            document.getElementById('pr-lightbox-img').src = '';
        }

        // Guardar
        document.querySelectorAll('.pr-save-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var card = btn.closest('.pr-card');
                var filename = card.getAttribute('data-filename');
                var textarea = card.querySelector('.pr-alt-textarea');
                var statusEl = card.querySelector('.pr-save-status');
                var text = textarea.value;

                btn.disabled = true;
                statusEl.textContent = 'Saving...';
                statusEl.className = 'pr-save-status';

                var formData = new FormData();
                formData.append('action', 'save_postcard_alt');
                formData.append('nonce', nonce);
                formData.append('filename', filename);
                formData.append('text', text);

                fetch(ajaxUrl, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    btn.disabled = false;
                    if (data.success) {
                        statusEl.textContent = 'Saved';
                        statusEl.className = 'pr-save-status success';
                        card.classList.add('saved-flash');

                        // Mark as OK in UI
                        if (card.getAttribute('data-status') === 'needs_review') {
                            card.setAttribute('data-status', 'ok');
                            card.classList.remove('needs-review');
                            // Update badge
                            var badge = card.querySelector('.pr-badge-review');
                            if (badge) {
                                badge.textContent = 'OK';
                                badge.className = 'pr-badge-ok';
                            }
                            // Update counter
                            var counterEl = document.getElementById('pr-review-count');
                            var current = parseInt(counterEl.textContent, 10);
                            if (current > 0) counterEl.textContent = current - 1;
                        }

                        setTimeout(function() {
                            card.classList.remove('saved-flash');
                            statusEl.textContent = '';
                        }, 2000);
                    } else {
                        statusEl.textContent = 'Error: ' + (data.data || 'unknown');
                        statusEl.className = 'pr-save-status error';
                    }
                })
                .catch(function(err) {
                    btn.disabled = false;
                    statusEl.textContent = 'Network error';
                    statusEl.className = 'pr-save-status error';
                });
            });
        });
    })();
    </script>
    <?php
}
