!function ($, ko, ê) {

    function parseModelCollection(modelConstructor, dataCollection) {
        ê.system.guard.argumentNotNull(modelConstructor, "modelConstructor");
        if(!dataCollection) {
            return [];
        }
        var result = [];
        dataCollection.forEach(function(element, index, array) {
            var item = new modelConstructor(element);
            if(item) {
                result.push(item);
            };
        });
        return result;
    }

    var githubApi = {
        models: {}
    };

    // GitHub User model
    githubApi.models.User = function (data) {
        if (!data) {
            data = {};
        }
        this.id = data.id;
        this.login = data.login;
        this.avatar_url = data.avatar_url;
        this.gravatar_id = data.gravatar_id;
        this.urls = {
            html: data.html_url,
            followers: data.followers_url,
            following: data.following_url,
            gists: data.gists_url,
            starred: data.starred_url,
            subscriptions: data.subscriptions_url,
            organizations: data.organizations_url,
            repos: data.repos_url,
            events: data.events_url,
            received_events: data.received_events_url
        };
        this.type = data.type;
        this.site_admin = data.site_admin;

        return this;
    };

    // GitHub Repository model
    githubApi.models.Repository = function (data) {
        if (!data) {
            data = {};
        }
        this.id = data.id;
        this.name = data.name;
        this.owner = new githubApi.models.User(data.owner || {});
        this.homepage = data.homepage;
        this.size = data.size;
        this.language = data.language;
        this.counts = {
            stargazers: data.stargazers_count,
            watchers: data.watchers_count,
            forks: data.forks_count,
            open_issue: data.open_issues_count
        };
        this.url = data.url;
        this.urls = {
            forks: data.forks_url,
            keys: data.keys_url,
            collaborators: data.collaborators_url,
            teams: data.teams_url,
            hooks: data.hooks_url,
            issue_events: data.issue_events_url,
            events: data.events_url,
            assignees: data.assignees_url,
            branches: data.branches_url,
            tags: data.tags_url,
            blobs: data.blobs_url,
            git_tags: data.git_tags_url,
            git_refs: data.git_refs_url,
            trees: data.trees_url,
            statuses: data.statuses_url,
            languages: data.languages_url,
            stargazers: data.stargazers_url,
            contributors: data.contributors_url,
            subscribers: data.subscribers_url,
            subscription: data.subscription_url,
            commits: data.commits_url,
            git_commits: data.git_commits_url,
            comments: data.comments_url,
            issue_comment: data.issue_comment_url,
            contents: data.contents_url,
            compare: data.compare_url,
            merges: data.merges_url,
            archive: data.archive_url,
            downloads: data.downloads_url,
            issues: data.issues_url,
            pulls: data.pulls_url,
            milestones: data.milestones_url,
            notifications: data.notifications_url,
            labels: data.labels_url,
            releases: data.releases_url,
            git: data.git_url,
            ssh: data.ssh_url,
            clone: data.clone_url,
            svn: data.svn_url
        };

        return this;
    };
    githubApi.models.Repository.parseCollection = function (dataCollection) {
      return parseModelCollection(githubApi.models.Repository, dataCollection);
    };

    // GitHub Asset model
    githubApi.models.Asset = function(data) {
        if(!data) {
            data = {};
        }
        this.id = data.id;
        this.name = data.name;
        this.label = data.label;
        this.state = data.state;
        this.content_type = data.content_type;
        this.size = data.size;
        this.counts = {
          download: data.download_count
        };
        this.created_at = data.created_at;
        this.uploaded_at = data.uploaded_at;
        this.uploader = new githubApi.models.User(data.uploader || {});
        this.url = data.url;
        this.urls = {
          browser_download: data.browser_download_url
        };
        return this;
    };
    githubApi.models.Asset.parseCollection = function(dataCollection) {
      return parseModelCollection(githubApi.models.Asset, dataCollection);
    };

    // GitHub Release model
    githubApi.models.Release = function (data) {
        if (!data) {
            data = {};
        }
        this.id = data.id;
        this.tag_name = data.tag_name;
        this.target_commitish = data.target_commitish;
        this.name = data.name;
        this.url = data.url;
        this.draft = data.draft;
        this.author = githubApi.models.User(data.author || {});
        this.prerelease = data.prerelease;
        this.created_at = data.created_at;
        this.published_at = data.published_at;
        this.body = data.body;
        this.urls = {
            assets: data.assets_url,
            upload: data.upload_url,
            html: data.html_url,
            tarball: data.tarball_url,
            zipball: data.zipball_url
        };
        this.assets = githubApi.models.Asset.parseCollection(data.assets || []);

        return this;
    };
    githubApi.models.Release.parseCollection = function(dataCollection) {
      return parseModelCollection(githubApi.models.Release, dataCollection);
    };

    function ViewModel() {
        this.everest = {
            version: ko.observable("0.0.0"),
            release_url: ko.observable("https://github.com/PulsarBlow/everestjs/releases"),
            download_url: ko.observable(""),
            sourcecode_url: ko.observable("")
        };

        this._initialize();
    }

    ViewModel.prototype._initialize = function () {
        //var that = this,
        //    restApi = new ê.RestApiClient({baseUrl: "https://api.github.com"});

//        restApi.read("repos/PulsarBlow/everestjs/releases")
//            .done(function(data) {
//                that.version(data[0].tag_name);
//            });
        var that = this,
            version = "0.0.0";
        $.ajax('https://api.github.com/repos/PulsarBlow/everestjs/releases')
            .done(function (data) {
                var releases = githubApi.models.Release.parseCollection(data),
                    current = releases[releases.length - 1];

                that.everest.version(current.tag_name);
                that.everest.release_url(current.urls.zipball);
                that.everest.download_url(current.assets[0].urls.browser_download);
                that.everest.sourcecode_url(current.urls.zipball);
            });
    };

    $(document).ready(function () {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        ko.applyBindings(new ViewModel());
    });
}(window.jQuery, window.ko, window.ê);