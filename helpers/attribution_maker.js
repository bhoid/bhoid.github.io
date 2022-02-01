/*
 * @Author: Greg Bird (@BirdyOz, greg.bird.oz@gmail.com)
 * @Date:   2018-05-10 10:37:58
 * @Last Modified by:   MPEdTech
 * @Last Modified time: 2021-09-13 07:50:57
 * @Last Modified time: 2022-01-31 11:05:00
 */

$(function() {

    // Get current date string
    let today = todaysDate();
    let site = "";
    let site_url = "";
    let site = ""; // Image site
    let site_url = ""; // Primary site URL
    let id = ""; // Image ID
    let img_name = "Image"; // Image name.   Default to "Photo"
    let img_name = "Image"; // Image name.   Default to "Image"
    let img_orig = ""; // Link to original image
    let img_src = ""; // src of image to be displayed in page
    let download_sml = ""; // Small image 960px wide
    let download_lge = ""; // Large image 1920px wide
    let alt = "";
    let user = "";
    let user_url = "";
    let licence = "";
    let licence_url = "";
    let download_sml = ""; // Small image 720px wide
    let download_lge = ""; // Large image 1440px wide
    let alt = ""; // alternative text
    let user = ""; // username
    let user_url = ""; //URL to user profile
    let licence = ""; // Licence type, eg "Free to use|Public Domain|CC-BY" etc.
    let licence_url = ""; // Link to licence
    let title = null; //If a title is set, this will be used
    let startCollapsed = false;
    let startCollapsed = false; // Default to non-collapsed view
    let org = null; // to cater for organisation specific changes
    let width = "col-5"; // Default width for floated images
    let json = ""; // JSON Object returned by API call
    let srcOriginal = "" // Original image SRC (High Res);

    // Get cookie values:

    let cookieWidth = Cookies.get('cookieWidth');
    let cookieCollapsed = Cookies.get('cookieCollapsed');


    // Set default button
    $("#source-open .start-hidden").button("toggle");

    // Read cookie
    if (cookieCollapsed === "false") {
        // If 'false', toggle button
        startCollapsed = false;
        $("#source-open .start-shown").button("toggle");
    }


    // Set relative size
    if (typeof cookieWidth !== "undefined" && cookieWidth !== width) {
        $('.maker-floated>figure').removeClass(width);
        width = cookieWidth;
        $('.maker-floated>figure').addClass(width);
    }





    // Flickr licences
    let flickr_licences = {
        "license": [
            { "id": 1, "name": "Attribution-NonCommercial-ShareAlike License", "short": "CC BY-NC-SA", "url": "https://creativecommons.org/licenses/by-nc-sa/2.0/" },
            { "id": 2, "name": "Attribution-NonCommercial License", "short": "CC BY-NC", "url": "https://creativecommons.org/licenses/by-nc/2.0/" },
            { "id": 3, "name": "Attribution-NonCommercial-NoDerivs License", "short": "CC BY-NC-ND", "url": "https://creativecommons.org/licenses/by-nc-nd/2.0/" },
            { "id": 4, "name": "Attribution License", "short": "CC BY", "url": "https://creativecommons.org/licenses/by/2.0/" },
            { "id": 5, "name": "Attribution-ShareAlike License", "short": "CC BY-SA", "url": "https://creativecommons.org/licenses/by-sa/2.0/" },
            { "id": 6, "name": "Attribution-NoDerivs License", "short": "CC BY-ND", "url": "https://creativecommons.org/licenses/by-nd/2.0/" },
            { "id": 7, "name": "No known copyright restrictions", "short": "Commons (Flickr)", "url": "https://www.flickr.com/commons/usage/" },
            { "id": 8, "name": "United States Government Work", "short": "U.S. Government Work", "url": "http://www.usa.gov/copyright.shtml" },
            { "id": 9, "name": "Public Domain Dedication (CC0)", "short": "CC0", "url": "https://creativecommons.org/publicdomain/zero/1.0/" },
            { "id": 10, "name": "Public Domain Mark", "short": "Public Domain", "url": "https://creativecommons.org/publicdomain/mark/1.0/" }
        ]
    }


    // Get URL parameters
    url_string = window.location.href;
    if (url_string.indexOf("?") > 0) {
@@ -47,6 +96,22 @@ $(function() {
            site = "Pexels";
            console.log("@GB: site = ", site);
        }
         if (img_orig.includes('flickr.com')) {
            site = "Flickr";
        }
        if (img_orig.includes('shutterstock.com')) {
            site = "Shutterstock";
        }

        // Detect organisation.
        // Allows for different attribution 'recipes' for different organsiations (eg MP).
        org = url.searchParams.get("org");

        // If I am Melb Poly, do not allow attribution to be collpased.
        if (org == 'mp') {
            startCollapsed = false;
            $('#collapser').hide();
        }

    } else {
        console.log("@GB: No parameters");
        $('.firsttime-warning').show();
        $('#collapseExample').show();
    }

    // If I am Unsplash
    if (site == "Unsplash") {

        // Get image ID
        n = img_orig.lastIndexOf('/');
        id = img_orig.substring(n + 1);
        site_url = "https://unsplash.com";
        licence = "Licence";
        licence_url = "https://unsplash.com/license";

        key = "336b527b2e18d045045820b78062b95c825376311326b2a08f9b93eef7efc07b"
        // API call
        uri = "https://api.unsplash.com/photos/" + id + "?client_id=336b527b2e18d045045820b78062b95c825376311326b2a08f9b93eef7efc07b";
        uri = "https://api.unsplash.com/photos/" + id + "?client_id=" + atob(decodeURIComponent(key));

        $.getJSON(uri, function(result) {
            console.log("@GB: result = ", result);
            img_src = result.urls.regular;
            console.log("@GB: img_src = ", img_src);
            user = result.user.username;
            user_url = result.user.links.html;
            title = result.description;
@@ -77,164 +142,224 @@ $(function() {
            img_src = download_lge;
            download_sml = img_src.replace("&w=1440", "&w=720");
            buildHTML();
            logger(json);
        });
    }

    // If I am Pexels
    if (site == "Pexels") {

        // Get image ID
        re = /[0-9]+/gi;
        id = re.exec(img_orig)[0];
        console.log("@GB: Pexels id = ", id);

        site_url = "https://pexels.com/";
        licence = "Licence";
        licence_url = "https://www.pexels.com/license/";
        api_key = "563492ad6f91700001000001bd31ce789c34409c931a6c42d10af8e5";
        key = "563492ad6f91700001000001bd31ce789c34409c931a6c42d10af8e5";
        uri = "https://api.pexels.com/v1/photos/" + id;

        // API call.   Using $.ajax as paxels requires authentication headers
        $.ajax({
            url: uri,
            dataType: 'json',
            headers: { 'Authorization': api_key },
            headers: { 'Authorization': atob(decodeURIComponent(key)) },
            success: function(data) {
                console.log("@GB: data = ", data);
                img_orig = data.src.original;
                console.log("@GB: img_orig = ", img_orig);
                img_orig = json.src.original;
                img_src = img_orig + "?auto=compress&cs=tinysrgb&w=1440";
                console.log("@GB: img_src = ", img_src);
                user = data.photographer;
                console.log("@GB: user = ", user);
                user_url = data.photographer_url;
                console.log("@GB: user_url = ", user_url);
                alt = data.url.split("/")[4].split("-");
                user = json.photographer;
                user_url = json.photographer_url;
                alt = json.url.split("/")[4].split("-");
                alt.pop();
                alt = alt.join(" ");
                console.log("@GB: alt = ", alt);
                download_sml = img_orig + "?auto=compress&cs=tinysrgb&w=720";
                download_sml = img_src + "?auto=compress&cs=tinysrgb&w=720";
                download_lge = img_src;
                buildHTML();
                logger(json);
            }
        });
    }

    // If I am Pixabay
    if (site == "Pixabay") {

        // Get image ID
        re = /[0-9]+/gi;
        id = re.exec(img_orig)[0];
        console.log("@GB: Pixabay id = ", id);

        site_url = "https://pixabay.com/";
        licence = "Licence";
        licence_url = "https://pixabay.com/service/license/";
        api_key = "23200140-02ba1576bde9ce669f28784f8";
        uri = "https://pixabay.com/api/?key=" + api_key + "&id=" + id;
        key = "23200140-02ba1576bde9ce669f28784f8";
        uri = "https://pixabay.com/api/?key=" + atob(decodeURIComponent(key)) + "&id=" + id;

        $.getJSON(uri, function() {})
            .done(function(data) {
                console.log("second success");
                console.log("@GB: data = ", data.hits[0]);
                img_src = data.hits[0].largeImageURL;
                console.log("@GB: img_src = ", img_src);
                user = data.hits[0].user;
                img_src = json.hits[0].largeImageURL;
                user = json.hits[0].user;
                user_url = "https://pixabay.com/users/" + user;
                alt = data.hits[0].tags;
                alt = json.hits[0].tags;
                img_name = "Image";
                download_sml = data.hits[0].webformatURL; // Small image 640px wide
                download_sml = json.hits[0].webformatURL; // Small image 640px wide
                download_lge = img_src; // Large image 1280px wide
                buildHTML();
                logger(json);
            });
    }

    // If I am Flickr
    if (site == "Flickr") {

        // Get image ID
        re = /\/([0-9]+)\//gi;
        id = re.exec(img_orig)[1];

        site_url = "https://www.flickr.com/";
        key = "b45466a5c06951b75635590af7f465e0";
        info_uri = "https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + atob(decodeURIComponent(key)) + "&photo_id=" + id + "&format=json&&nojsoncallback=1";
        sizes_uri = "https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + atob(decodeURIComponent(key)) + "&photo_id=" + id + "&format=json&&nojsoncallback=1";


        $.getJSON(info_uri, function() {})
            .done(function(json) {
                let lic = json.photo.license;
                // Image is copyrighted
                if (lic == 0) {
                    $('.flickr-warning').show();
                    console.log("You cannot use that image");
                }
                // Image is CC or PD and image use is allowed
                else {
                    licence = flickr_licences.license.find(item => item.id == lic).short;
                    licence_url = flickr_licences.license.find(item => item.id == lic).url;
                    user = json.photo.owner.realname;
                    user_url = "https://www.flickr.com/photos/" + json.photo.owner.nsid;
                    alt = json.photo.title._content;
                    title = json.photo.description._content;
                    title = stripHTML(title);
                    // get image sizes
                    $.getJSON(sizes_uri, function() {})
                        .done(function(json2) {
                            img_src = json2.sizes.size.find(item => item.label == "Original").source;
                            let orig_width = json2.sizes.size.find(item => item.label == "Original").width;
                            // Check if image is large enough to resize
                            if (orig_width >= 800) {
                                download_sml = json2.sizes.size.find(item => item.label == "Medium 800").source
                            } else { download_sml = img_src };

                            if (orig_width >= 1600) {
                                download_lge = json2.sizes.size.find(item => item.label == "Large 1600").source
                                img_src = download_lge
                            } else { download_lge = img_src };

                            buildHTML();
                            // Merge back into one JSON object, for logger
                            $.extend(json, json2);
                            logger(json);
                        })
                }
                //     download_sml = json.hits[0].webformatURL; // Small image 640px wide
                //     download_lge = img_src; // Large image 1280px wide
                //     buildHTML();

            })
            .fail(function() {
                console.log("error");
            });
    }

    // If I am Wikimedia
    if (site == "Wikimedia Commons") {

        // Get image ID
        n = img_orig.lastIndexOf('/');
        id = img_orig.substring(n + 1);
        console.log("@GB: Wikimedia file id = ", id);

        if (!id.includes('File:')) {
            console.log("@GB: id does not include File: = ", id);
            id = "File:" + id;
        }
        site_url = "https://commons.wikimedia.org/";
        uri = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&list=&meta=&iiprop=timestamp%7Cuser%7Cextmetadata%7Curl%7Cuserid&iilimit=1&iiurlwidth=1440&origin=*&titles=" + id;
        console.log("@GB: uri = ", uri);


        $.getJSON(uri, function() {})
            .done(function(data) {
                json = data.query.pages[-1];
                console.log("@GB: json = ", json);
                img_src = json.imageinfo[0].thumburl;
                console.log("@GB: img_src = ", img_src);
                user = json.imageinfo[0].user;
                user_url = "https://commons.wikimedia.org/wiki/User:" + user.replace(" ", "_");
                console.log("@GB: user_url = ", user_url);
                alt = json.imageinfo[0].extmetadata.ObjectName.value;
                console.log("@GB: alt = ", alt);
                img_name = "Image";
                download_sml = img_src.replace("1440px", "720px"); // Small image 720px wide
                console.log("@GB: download_sml = ", download_sml);
                download_lge = img_src; // Large image 1440px wide
                console.log("@GB: download_lge = ", download_lge);
                download_lge = download_sml = img_src; // Small image 720px wide

                if (json.imageinfo[0].thumbwidth >= 720) {
                    download_lge = json.imageinfo[0].responsiveUrls[2]; // Large image 1440px wide
                    img_src = download_lge;
                }

                licence = json.imageinfo[0].extmetadata.LicenseShortName.value;
                console.log("@GB: licence = ", licence);

                // Exception for public domain images    
                try {
                    licence_url = json.imageinfo[0].extmetadata.LicenseUrl.value;
                } catch (error) {
                    console.error("Error: " + error);
                    // expected output: ReferenceError: nonExistentFunction is not defined
                    // Note - error messages will vary depending on browser
                    licence_url = "https://en.wikipedia.org/wiki/Public_domain";
                }
                console.log("@GB: licence_url = ", licence_url);

                id = id.slugify();
                console.log("@GB: Sluggified id = ", id);
                buildHTML();
                logger(json);
            });
    }


   // Change relative image size for floated images
    $('#resizer').change(function() {
        selected_id = $("input[name='options']:checked").attr('id');
        selected_val = $("input[name='options']:checked").attr('value');
        console.log("@GB: selected_text = ", selected_val);
        console.log("@GB: selected_id = ", selected_id);
        Cookies.set('cookieWidth', selected_id, { expires: 365, path: '' });
        $('.maker-floated>figure').removeClass(width);
        $('.maker-floated>figure').addClass(selected_id);
        $('.percent').text(selected_val);
        width = selected_id;
        console.log("@GB: width = ", width);
    });


    // Change whether attribution is visible or collapsed (collapsed by default)
    $('#source-open').change(function() {
        selected_val = $("input[name='options']:checked").attr('value');
        console.log("@GB: selected_val = ", selected_val);

        if (selected_val == "Shown") {
            startCollapsed = false;
            buildHTML();
        } else {
            startCollapsed = false;
            buildHTML();
        }

        Cookies.set('cookieCollapsed', startCollapsed, { expires: 365, path: '' });
    });


    $('#embedder button').click(function(event) {
        /* Act on the event */
        // Cancel the default action
        event.preventDefault();
        var btn = $(this);
        console.log("@GB: btn = ", btn);
        var closest = btn.prev('.maker-copy');
        console.log("@GB: closest = ", closest);
        var id = "." + btn.attr('id');
        console.log("@GB: id = ", id);
        var paste = $(id).html();
        console.log("@GB: paste = ", paste);

        // If Cropped, replace image in embed code with dummy image
        if (id == ".maker-cropped") {
            paste = paste.replace(srcOriginal, "https://dummyimage.com/1440x760/b094b0/e3b1e3&text=Replace+me+with+cropped+image");
        }

        // If Pixabay, replace image in embed code with dummy image
        if (site == "Pixabay") {
            paste = paste.replace(img_src, "https://dummyimage.com/1440x760/b094b0/e3b1e3&text=Replace+me+with+downloaded+Pixabay+image");
        }
        console.log("@GB: Copied HTML = ", paste);
        copyTextToClipboard(paste);


        btn.toggleClass('btn-outline-primary btn-success');
        btn.html('<i class="fa fa-check" aria-hidden="true"></i> Done! Embed code copied to clipboard');


        window.setTimeout(function() {
            btn.html('<i class="fa fa-clipboard" aria-hidden="true"></i> Copy embed code');
            // btn.removeClass('btn-danger');
            btn.toggleClass('btn-outline-primary btn-success');
        }, 3000);

    });


    // Download appropriately sized image
    $('a.download').click(function(event) {
        /* Act on the event */
        btn = $(this);
        title = btn.attr("title");
        src = download_lge;
        if (title == "img-sml") {
            src = download_sml;
        }
        console.log("@GB: download_url = ", src);
        if (title == "img-cropped") {
            src = $(".maker-cropped img").attr("src");
        }

        // Send to Downloader
        downloader(id, src);

        btn.toggleClass('btn-outline-primary btn-success');
        btn.html('<i class="fa fa-check" aria-hidden="true"></i> Done! Image downloaded');
        // Cancel the default action
        event.preventDefault();
    });

    // Return appropriate Embed Code snippet
    function unsplashSnippet(i) {
        var snippet =
            `<img src="${img_src}" class="img-responsive img-fluid img-sml" alt="${alt}"${title!==null ? ` title="${title}"` : ''}>
@@ -276,14 +406,87 @@ $(function() {
</figcaption>`;
        return snippet;
    }

       // If Org = MP, return Melb Poly embed code
    function mpSnippet(i) {
        var snippet = `<img src="${img_src}" class="img-responsive img-fluid w-100" alt="${alt}"${title!==null ? ` title="${title}"` : ''}>
<figcaption class="figure-caption text-muted small fw-lighter">
    <small><a href="${img_orig}" target="_blank">Image</a> by <a href="${user_url}" target="_blank">${user}</a> on <a href="${site_url}" target="_blank">${site}</a>, <a href="${licence_url}" target="_blank">${licence}</a>, added on ${today}</small>
</figcaption>`;
        return snippet;
    }

    // Text only snippet
    function textSnippet() {
        var snippet = `<small class="text-muted"><a href="${img_orig}" target="_blank">${img_name}</a> by <a href="${user_url}" target="_blank">${user}</a> on <a href="${site_url}" target="_blank">${site}</a>, <a href="${licence_url}" target="_blank">${licence}</a>, added on ${today}</small>`;
        return snippet;
    }

     // Build images into interface
    function buildHTML() {
        $('.maker-copy figure').each(function(index) {
            snippet = unsplashSnippet(index);
            if (org == 'mp') {
                // Use Melb Poly's attribution rules
                if (site != "Wikimedia Commons") {
                    licence = "Licence";
                }
                snippet = mpSnippet(index);
            } else { snippet = embedSnippet(index); }

            $(this).html(snippet);

            // Set Cropped and Text only alternateives
            $("#rcrop").attr("src", img_src);
            $(".maker-txt").html(textSnippet());

            $("#resizer ." + width).button("toggle");
        });

        // Invoke rcrop (image cropper)
        // Set defaults
        var $img = $('#rcrop'),
            $update = $('#update'),
            inputs = {
                x: $('#x'),
                y: $('#y'),
                width: $('#width'),
                height: $('#height')
            },
            fill = function() {
                var values = $img.rcrop('getValues');
                for (var coord in inputs) {
                    inputs[coord].val(values[coord]);
                }
            }

        // Define rcrop
        $('#rcrop').rcrop({
            minSize: [200, 200],
            preserveAspectRatio: false,
            grid: true,
            preview: {
                display: true,
                size: ['40%', '40%'],
                wrapper: '#custom-preview-wrapper',
            }

        });

        // Update cropped image on change
        $('#rcrop').on('rcrop-changed rcrop-ready', function() {
            srcOriginal = $(this).rcrop('getDataURL');
            var srcResized = $(this).rcrop('getDataURL', 50, 50);
            $(".maker-cropped img").attr("src", srcOriginal);
            fill()
        });

        $update.click(function() {
            $img.rcrop('resize', inputs.width.val(), inputs.height.val(), inputs.x.val(), inputs.y.val());
            fill();
        })
    }

    // Return today's date in dd/mm/yyyy format
    function todaysDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

     // log all console messages
    function logger(json) {
        console.groupCollapsed('@MPIA: Attribution maker values')
        console.log("@MPIA: today = ",today)
        console.log("@MPIA: site = ",site)
        console.log("@MPIA: site_url = ",site_url)
        console.log("@MPIA: id = ",id)
        console.log("@MPIA: img_name = ",img_name)
        console.log("@MPIA: img_orig = ",img_orig)
        console.log("@MPIA: img_src = ",img_src)
        console.log("@MPIA: download_sml = ",download_sml)
        console.log("@MPIA: download_lge = ",download_lge)
        console.log("@MPIA: alt = ",alt)
        console.log("@MPIA: user = ",user)
        console.log("@MPIA: user_url = ",user_url)
        console.log("@MPIA: licence = ",licence)
        console.log("@MPIA: licence_url = ",licence_url)
        console.log("@MPIA: title = ",title)
        console.log("@MPIA: startCollapsed = ",startCollapsed)
        console.log("@MPIA: org = ",org)
        console.log("@MPIA: width = ",width)
        console.log("@MPIA: srcOriginal = ",srcOriginal)
        console.log("@MPIA: cookieWidth = ",cookieWidth)
        console.log("@MPIA: cookieCollapsed = ",cookieCollapsed)
        console.log("@MPIA: json = ",json)
        console.groupEnd()
    }

    // Copy to clipboard for dumb browsers
    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
        } catch (err) {
        }
        document.body.removeChild(textArea);
    }

    // Copy to clipboard
    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
        }, function(err) {
        });
    }

    // Download appropriately sized image.
    // Dynamically create an offscreen canvas area, load the chosen image,
    // then create a file from the Canvas content
    function downloader(name, content) {
        var image = new Image();
        image.crossOrigin = "anonymous";
        image.src = content;
        // get file name - you might need to modify this if your image url doesn't contain a file extension otherwise you can set the file name manually
        var fileName = image.src.split(/(\\|\/)/g).pop();
        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            console.log("@GB: canvas.width = ", canvas.width);
            console.log("@MPIA: canvas.width = ", canvas.width);
            canvas.getContext('2d').drawImage(this, 0, 0);
            var blob;
            blob = canvas.toDataURL("image/jpeg");
            var link = document.createElement('a');
            link.style = 'position: fixed; left -10000px;';
            link.href = blob;

            link.download = site + "-" + name + "-" + canvas.width + "x" + canvas.height + ".jpg";
            console.log("@GB: link.download = ", link.download);
            console.log("@MPIA: link.download = ", link.download);


            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

    }

    // Sanitise text to remove HTML markup.
    function stripHTML(str) {
        str = $.parseHTML(str); // Convert str to DOM
        str = $(str).text().trim(); // Strip out HTML elements
        return str;
    }

    // Sanitise text to remove special chars. Sluggify output.
    String.prototype.slugify = function(separator = "-") {
        return this
            .toString()
            .normalize('NFD') // split an accented letter in the base letter and the acent
            .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9 ]/g, separator) // remove all chars not letters, numbers and spaces (to be replaced)
            .replace(/\s+/g, separator);
    };
});
